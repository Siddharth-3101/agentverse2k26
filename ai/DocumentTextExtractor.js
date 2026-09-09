/**
 * DocumentTextExtractor.js
 * Independent RAG + OCR Document Text Intelligence Engine.
 *
 * RAG + OCR Pipeline:
 *   1. OCR & Pixel Recognition Layer: Tesseract.js / pdf-parse
 *   2. Document Context Retrieval Layer: Extracts document chunks & section blocks
 *   3. Grounded Augmentation Layer: Prepares zero-hallucination prompts for Ollama LLM
 *   4. Generation Layer: Factual JSON extraction
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const MIN_TEXT_THRESHOLD = 30; // chars needed to treat a PDF as text-based

class DocumentTextExtractor {
  constructor(options = {}) {
    this.ocrEngineName           = options.ocrEngine             || 'tesseract.js';
    this.ocrConfidenceThreshold  = options.ocrConfidenceThreshold || 40;
  }

  /**
   * Extract raw text from a document file.
   * @param {string} filePath
   * @param {string} mimeType  (optional hint)
   * @returns {Promise<ExtractionResult>}
   *
   * ExtractionResult shape:
   * {
   *   success: boolean,
   *   text: string,
   *   isScanned: boolean,
   *   extractor: string,
   *   ocrConfidence: number | null,
   *   error: string | null,
   *   errorDetail?: string,
   *   requires_verification?: boolean
   * }
   */
  async extractText(filePath, mimeType = '') {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Document file not found: ${filePath}`);
    }

    const ext     = path.extname(filePath).toLowerCase();
    const isPdf   = ext === '.pdf'  || mimeType.includes('pdf');
    const isImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
                    || mimeType.includes('image');

    if (isPdf)   return await this._extractPdfText(filePath);
    if (isImage) return await this._extractImageOcr(filePath);

    // Plain-text file
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      success: true, text: content, isScanned: false,
      extractor: 'plaintext-reader', ocrConfidence: null, error: null
    };
  }

  // ─── PDF ────────────────────────────────────────────────────────────────────

  async _extractPdfText(filePath) {
    let directText = '';

    try {
      const pdfParse = require('pdf-parse');
      const data     = await pdfParse(fs.readFileSync(filePath));
      directText     = data.text ? data.text.trim() : '';
    } catch (err) {
      console.warn('[DocumentTextExtractor] pdf-parse error:', err.message);
    }

    if (directText.length >= MIN_TEXT_THRESHOLD) {
      return {
        success: true, text: directText, isScanned: false,
        extractor: 'pdf-parse', ocrConfidence: null, error: null
      };
    }

    // Scanned PDF — attempt OCR on rendered pages
    console.log('[DocumentTextExtractor] Scanned PDF detected – attempting page OCR…');
    return await this._ocrScannedPdf(filePath, directText);
  }

  async _ocrScannedPdf(filePath, partialText) {
    try {
      const { fromPath } = require('pdf2pic');
      const os     = require('os');
      const tmpDir = os.tmpdir();

      const converter = fromPath(filePath, {
        density: 150, savename: 'pg', savedir: tmpDir,
        format: 'png', width: 2048, height: 2048
      });

      // Determine page count (cap at 10 for performance)
      let pageCount = 1;
      try {
        const data = await require('pdf-parse')(fs.readFileSync(filePath));
        pageCount  = Math.min(data.numpages || 1, 10);
      } catch (_) {}

      const pageTexts = [];

      for (let p = 1; p <= pageCount; p++) {
        try {
          const img     = await converter(p, { responseType: 'image' });
          const imgPath = img.path || img;
          if (imgPath && fs.existsSync(imgPath)) {
            const ocr = await this._runTesseract(imgPath);
            if (ocr.success) pageTexts.push(ocr.text);
            try { fs.unlinkSync(imgPath); } catch (_) {} // clean temp file
          }
        } catch (e) {
          console.warn(`[DocumentTextExtractor] Page ${p} OCR error:`, e.message);
        }
      }

      const combined = pageTexts.join('\n\n').trim();
      if (combined.length >= MIN_TEXT_THRESHOLD) {
        return {
          success: true, text: combined, isScanned: true,
          extractor: 'pdf2pic+tesseract', ocrConfidence: null, error: null
        };
      }

      return this._ocrFailureResult('OCR produced insufficient text from scanned PDF pages.');

    } catch (e) {
      console.warn('[DocumentTextExtractor] pdf2pic unavailable:', e.message);

      // If partial text was recovered by pdf-parse, use it
      if (partialText && partialText.length > 0) {
        return {
          success: true, text: partialText, isScanned: true,
          extractor: 'pdf-parse-partial', ocrConfidence: null,
          error: 'pdf2pic unavailable; partial text returned'
        };
      }

      return this._ocrFailureResult(
        'Scanned PDF: pdf2pic not installed. Run: npm install pdf2pic'
      );
    }
  }

  // ─── Image OCR ──────────────────────────────────────────────────────────────

  async _extractImageOcr(filePath) {
    const result = await this._runTesseract(filePath);
    if (result.success) {
      return {
        success: true, text: result.text, isScanned: true,
        extractor: 'tesseract.js', ocrConfidence: result.confidence, error: null
      };
    }
    return this._ocrFailureResult(result.errorMessage);
  }

  /**
   * Internal Tesseract runner — NEVER returns fake text on failure.
   */
  async _runTesseract(imgPath) {
    try {
      const Tesseract  = require('tesseract.js');
      const result     = await Tesseract.recognize(imgPath, 'eng', { logger: () => {} });
      const text       = result.data.text ? result.data.text.trim() : '';
      const confidence = result.data.confidence || 0;
      if (!text) {
        return { success: false, text: '', confidence: 0, errorMessage: 'Tesseract returned empty text.' };
      }
      return { success: true, text, confidence, errorMessage: null };
    } catch (err) {
      return { success: false, text: '', confidence: 0, errorMessage: err.message };
    }
  }

  // ─── Safe Failure Response ───────────────────────────────────────────────────

  /**
   * Safe non-fabricated OCR failure result.
   * NEVER contains demo/example certificate text.
   */
  _ocrFailureResult(reason = 'OCR failed') {
    return {
      success              : false,
      text                 : '',
      isScanned            : true,
      extractor            : 'ocr-failed',
      ocrConfidence        : 0,
      error                : 'OCR_FAILED',
      errorDetail          : reason,
      requires_verification: true
    };
  }
}

module.exports = DocumentTextExtractor;
