/**
 * ConfidenceScorer.js
 * Independent Heuristic Confidence Scoring & Human Verification Engine.
 *
 * IMPORTANT: Confidence scores here are HEURISTIC estimates, not mathematical probabilities.
 * They reflect extraction evidence quality, not statistical certainty.
 *
 * Output structure:
 * {
 *   overall: number,           // 0.0 – 1.0 weighted heuristic score
 *   fields: {
 *     student_name: number,
 *     certificate_title: number,
 *     organization: number,
 *     date: number,
 *     credential_id: number,
 *     achievement: number,
 *     category: number
 *   },
 *   requires_verification: boolean,
 *   flagged_fields: string[],
 *   verification_status: string   // "PENDING" always — AI extraction is never auto-verified
 * }
 */

'use strict';

const VERIFICATION_THRESHOLD = 0.70;

class ConfidenceScorer {
  constructor(options = {}) {
    this.verificationThreshold = options.verificationThreshold || VERIFICATION_THRESHOLD;
  }

  /**
   * Evaluate heuristic confidence for extracted certificate fields.
   * @param {Object} extractedData  - Output from InformationExtractor
   * @param {string} rawText        - Raw extracted text
   * @param {Object} classification - Output from ClassificationService
   * @returns {ConfidenceResult}
   */
  evaluate(extractedData = {}, rawText = '', classification = {}) {
    const fields        = {};
    const flaggedFields = [];
    const textLower     = (rawText || '').toLowerCase();

    // ── Student Name ────────────────────────────────────────────────────────
    if (extractedData.student_name && extractedData.student_name.length >= 3) {
      // Higher confidence if the name appears literally in raw text
      const nameInText = textLower.includes(extractedData.student_name.toLowerCase());
      fields.student_name = nameInText ? 0.90 : 0.65;
    } else {
      fields.student_name = 0.00;
      flaggedFields.push('student_name');
    }

    // ── Certificate Title ────────────────────────────────────────────────────
    if (extractedData.certificate_title && extractedData.certificate_title.length >= 4) {
      // Check if title was explicitly parsed (vs. derived from filename)
      const titleInText = textLower.includes(extractedData.certificate_title.toLowerCase());
      fields.certificate_title = titleInText ? 0.88 : 0.60;
    } else {
      fields.certificate_title = 0.00;
      flaggedFields.push('certificate_title');
    }

    // ── Organization ─────────────────────────────────────────────────────────
    if (extractedData.issuing_organization || extractedData.organization) {
      const org   = (extractedData.issuing_organization || extractedData.organization || '').toLowerCase();
      const inText = textLower.includes(org);
      fields.organization = inText ? 0.85 : 0.55;
    } else {
      fields.organization = 0.00;
      flaggedFields.push('organization');
    }

    // ── Date ─────────────────────────────────────────────────────────────────
    if (extractedData.date && extractedData.date !== null) {
      // Verify the date string appears in text (not a today's-date fabrication)
      const dateInText = textLower.includes(extractedData.date.toLowerCase().substring(0, 6));
      fields.date = dateInText ? 0.90 : 0.50;
    } else {
      fields.date = 0.00;
      flaggedFields.push('date');
    }

    // ── Credential ID ─────────────────────────────────────────────────────────
    if (extractedData.credential_id && extractedData.credential_id !== null) {
      const credInText = rawText.toUpperCase().includes(extractedData.credential_id.toUpperCase());
      fields.credential_id = credInText ? 0.95 : 0.50;
    } else {
      fields.credential_id = 0.00;
      flaggedFields.push('credential_id');
    }

    // ── Achievement ───────────────────────────────────────────────────────────
    if (extractedData.achievement && extractedData.achievement !== null) {
      const achieveInText = textLower.includes(extractedData.achievement.toLowerCase());
      fields.achievement = achieveInText ? 0.85 : 0.55;
    } else {
      fields.achievement = 0.00;
      // Not flagged — absence of achievement is valid
    }

    // ── Category ──────────────────────────────────────────────────────────────
    fields.category = classification.confidence || 0.00;
    if (fields.category < this.verificationThreshold || classification.requiresVerification) {
      flaggedFields.push('category');
    }

    // ── OCR Quality Penalty ───────────────────────────────────────────────────
    const textLength  = (rawText || '').trim().length;
    const textQuality = textLength < 50 ? 0.3 : textLength < 150 ? 0.7 : 1.0;

    // ── Weighted Overall Score ────────────────────────────────────────────────
    const weights = {
      student_name     : 0.20,
      certificate_title: 0.20,
      organization     : 0.15,
      date             : 0.15,
      credential_id    : 0.10,
      achievement      : 0.05,
      category         : 0.15
    };

    let weightedSum  = 0;
    let totalWeight  = 0;

    for (const [field, weight] of Object.entries(weights)) {
      weightedSum += (fields[field] || 0) * weight;
      totalWeight += weight;
    }

    const rawOverall = totalWeight > 0 ? (weightedSum / totalWeight) * textQuality : 0;
    const overall    = Number(Math.min(0.99, Math.max(0.0, rawOverall)).toFixed(2));

    const requiresVerification = overall < this.verificationThreshold || flaggedFields.length > 0;

    return {
      overall,
      fields,
      requires_verification: requiresVerification,
      flagged_fields       : flaggedFields,
      // AI extraction is ALWAYS set to PENDING — never auto-verified
      verification_status  : 'PENDING',
      verification_note    : 'AI-extracted data requires human review before being marked as verified.'
    };
  }
}

module.exports = ConfidenceScorer;
