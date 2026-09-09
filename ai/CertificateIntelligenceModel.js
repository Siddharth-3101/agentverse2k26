/**
 * CertificateIntelligenceModel.js
 * Master Certificate Intelligence Pipeline Orchestrator.
 *
 * Pipeline:
 *   1. Document Text Extraction / OCR
 *   2. Information & Entity Extraction (Pattern Extractor + Ollama Local LLM)
 *   3. Anti-Hallucination Double Verification Guardrail
 *   4. Category Classification
 *   5. Skill Harvesting (Multi-Domain Ontology)
 *   6. Heuristic Confidence Scoring
 *   → Returns structured result with verification_status: "PENDING"
 *
 * If OCR fails, returns a safe error result — never processes fake text.
 */

'use strict';

const DocumentTextExtractor  = require('./DocumentTextExtractor');
const InformationExtractor   = require('./InformationExtractor');
const ClassificationService  = require('./ClassificationService');
const SkillExtractionService = require('./SkillExtractionService');
const ConfidenceScorer       = require('./ConfidenceScorer');
const OllamaService          = require('./OllamaService');

class CertificateIntelligenceModel {
  constructor(options = {}) {
    this.textExtractor  = new DocumentTextExtractor(options);
    this.infoExtractor  = new InformationExtractor(options);
    this.classifier     = new ClassificationService(options);
    this.skillHarvester = new SkillExtractionService(options);
    this.scorer         = new ConfidenceScorer(options);
    this.ollamaService  = new OllamaService(options);
  }

  // ─── File-Based Processing ───────────────────────────────────────────────────

  async processCertificate(filePath, fileName = '', mimeType = '') {
    const effectiveFileName = fileName || require('path').basename(filePath);

    // Step 1: Text extraction / OCR
    const extraction = await this.textExtractor.extractText(filePath, mimeType);

    if (!extraction.success || !extraction.text) {
      return {
        success    : false,
        error      : extraction.error || 'TEXT_EXTRACTION_FAILED',
        errorDetail: extraction.errorDetail || 'No text could be extracted from the document.',
        source_file: effectiveFileName,
        text_extraction: {
          success   : false,
          is_scanned: extraction.isScanned,
          extractor : extraction.extractor,
          error     : extraction.error
        },
        verification: {
          verification_status  : 'PENDING',
          requires_verification: true,
          flagged_fields       : ['all'],
          verification_note    : 'Document processing failed — human review required.'
        },
        processed_at: new Date().toISOString()
      };
    }

    return await this._runPipelineAsync(extraction.text, extraction, effectiveFileName);
  }

  // ─── Text-Based Processing ───────────────────────────────────────────────────

  processText(rawText = '', fileName = 'direct-text-input') {
    if (!rawText || !rawText.trim()) {
      return {
        success    : false,
        error      : 'EMPTY_INPUT',
        errorDetail: 'No text was provided for processing.',
        source_file: fileName,
        verification: {
          verification_status  : 'PENDING',
          requires_verification: true,
          flagged_fields       : ['all']
        },
        processed_at: new Date().toISOString()
      };
    }

    const extraction = {
      success   : true,
      text      : rawText,
      isScanned : false,
      extractor : 'direct-text',
      ocrConfidence: null,
      error     : null
    };

    return this._runPipeline(rawText, extraction, fileName);
  }

  // ─── Core Pipeline ───────────────────────────────────────────────────────────

  async _runPipelineAsync(rawText, extraction, fileName) {
    // Step 2: Information extraction (Pattern-based baseline)
    let extracted = this.infoExtractor.extract(rawText, fileName);

    // Step 2b: Try Ollama LLM Extraction if local Ollama server is running
    try {
      const isOllamaOnline = await this.ollamaService.isAvailable();
      if (isOllamaOnline) {
        const ollamaEntities = await this.ollamaService.extractCertificateEntities(rawText);
        if (ollamaEntities) {
          // Double Verification Guardrail: Verify any LLM string actually exists in rawText
          extracted = this._applyGroundedLlmEntities(extracted, ollamaEntities, rawText);
        }
      }
    } catch (_) {
      // Fallback silently to pattern-extracted values on LLM error/timeout
    }

    return this._finishPipeline(rawText, extracted, extraction, fileName);
  }

  _runPipeline(rawText, extraction, fileName) {
    const extracted = this.infoExtractor.extract(rawText, fileName);
    return this._finishPipeline(rawText, extracted, extraction, fileName);
  }

  _finishPipeline(rawText, extracted, extraction, fileName) {
    // Step 3: Classification
    const classification = this.classifier.classify(rawText, extracted);

    // Step 4: Skill extraction
    const skills = this.skillHarvester.extractSkills(rawText, {
      certificate_title: extracted.certificate_title,
      event_name       : extracted.event_name,
      category         : classification.category,
      certificate_type : extracted.certificate_type
    });

    extracted.skills = skills;

    // Step 5: Confidence scoring
    const confidence = this.scorer.evaluate(extracted, rawText, classification);

    return {
      success       : true,
      source_file   : fileName,
      extracted_data: {
        student_name        : extracted.student_name,
        certificate_title   : extracted.certificate_title,
        event_name          : extracted.event_name,
        organization        : extracted.organization,
        issuing_organization: extracted.issuing_organization,
        category            : classification.category,
        certificate_type    : extracted.certificate_type,
        date                : extracted.date,
        start_date          : extracted.start_date,
        end_date            : extracted.end_date,
        achievement         : extracted.achievement,
        description         : extracted.description,
        position            : extracted.position,
        event_type          : extracted.event_type,
        duration            : extracted.duration,
        credential_id       : extracted.credential_id,
        certificate_number  : extracted.credential_id,
        skills              : skills
      },
      text_extraction: {
        success      : extraction.success,
        is_scanned   : extraction.isScanned,
        extractor    : extraction.extractor,
        ocr_confidence: extraction.ocrConfidence,
        pipeline     : 'RAG + OCR Pipeline'
      },
      classification: {
        category            : classification.category,
        top_level_category  : classification.topLevelCategory,
        confidence          : classification.confidence,
        match_reason        : classification.matchReason,
        requires_verification: classification.requiresVerification
      },
      skills,
      confidence: {
        overall             : confidence.overall,
        fields              : confidence.fields,
        requires_verification: confidence.requires_verification,
        flagged_fields      : confidence.flagged_fields
      },
      verification: {
        verification_status  : 'PENDING',
        requires_verification: true,
        flagged_fields       : confidence.flagged_fields,
        verification_note    : confidence.verification_note
      },
      processed_at: new Date().toISOString()
    };
  }

  // ─── Double Verification Anti-Hallucination Guardrail ────────────────────────

  /**
   * Cross-checks LLM extracted entities against raw document text.
   * If an LLM-extracted value does NOT exist in rawText, set to null.
   */
  _applyGroundedLlmEntities(baseline, llmEntities, rawText) {
    const textLower = rawText.toLowerCase();

    const verifyString = (llmVal, baselineVal) => {
      if (!llmVal || typeof llmVal !== 'string') return baselineVal;
      const clean = llmVal.trim();
      if (!clean) return baselineVal;

      // Grounding Check: Must exist in rawText as a substring
      if (textLower.includes(clean.toLowerCase())) {
        return clean;
      }
      // If LLM produced hallucinated string not in text, fallback to pattern baseline
      return baselineVal;
    };

    return {
      ...baseline,
      student_name        : verifyString(llmEntities.student_name, baseline.student_name),
      certificate_title   : verifyString(llmEntities.certificate_title, baseline.certificate_title),
      issuing_organization: verifyString(llmEntities.issuing_organization, baseline.issuing_organization),
      organization        : verifyString(llmEntities.issuing_organization, baseline.organization),
      date                : verifyString(llmEntities.date, baseline.date),
      credential_id       : verifyString(llmEntities.credential_id, baseline.credential_id),
      achievement         : verifyString(llmEntities.achievement, baseline.achievement)
    };
  }
}

module.exports = CertificateIntelligenceModel;
