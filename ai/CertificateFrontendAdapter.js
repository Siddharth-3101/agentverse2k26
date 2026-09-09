/**
 * CertificateFrontendAdapter.js
 * Maps AI internal certificate data model → frontend-compatible certificate object.
 *
 * AI internal model (snake_case) → Frontend model (camelCase)
 *   certificate_title  → title
 *   organization       → issuer
 *   date               → issueDate
 *   credential_id      → credentialId
 *   achievement        → grade
 *   skills[]           → skills[]
 *   verification_status → isVerified (true only if HUMAN_VERIFIED)
 *
 * The adapter does NOT modify the AI's internal data model.
 * The frontend should consume this adapter's output only.
 */

'use strict';

class CertificateFrontendAdapter {
  /**
   * Convert a single AI-extracted certificate to frontend shape.
   * @param {Object} aiCertificate  - AI extracted_data object from CertificateIntelligenceModel
   * @param {string} id             - Optional ID (e.g., from storage)
   * @returns {FrontendCertificate}
   *
   * FrontendCertificate:
   * {
   *   id, title, issuer, issueDate, category, credentialId,
   *   skills, grade, isVerified, thumbnail, description, evidenceStatus
   * }
   */
  toFrontend(aiCertificate, id = null) {
    if (!aiCertificate) return null;

    const skillNames = (aiCertificate.skills || []).map(s =>
      typeof s === 'string' ? s : (s && s.name) || null
    ).filter(Boolean);

    const topLevelMap = {
      'Hackathon': 'Events', 'Competition': 'Events', 'Workshop': 'Events',
      'Conference': 'Events', 'Club Activity': 'Events', 'Sports': 'Events',
      'Cultural': 'Events', 'Volunteering': 'Events', 'Leadership': 'Events',
      'Internship': 'Internships',
      'Certification': 'Certifications', 'Course': 'Certifications',
      'Publication': 'Certifications', 'Other': 'Certifications'
    };

    const fineCategory     = aiCertificate.category || 'Other';
    const topLevelCategory = aiCertificate.topLevelCategory || topLevelMap[fineCategory] || 'Certifications';

    return {
      id              : id || aiCertificate.id || null,
      title           : aiCertificate.certificate_title   || aiCertificate.title  || null,
      issuer          : aiCertificate.issuing_organization || aiCertificate.organization || null,
      issueDate       : aiCertificate.date                || aiCertificate.issueDate || null,
      category        : fineCategory,
      topLevelCategory: topLevelCategory,
      credentialId    : aiCertificate.credential_id       || aiCertificate.credentialId || null,
      skills        : skillNames,
      grade         : aiCertificate.achievement         || null,  // null if no achievement found
      description   : aiCertificate.description         || null,
      // Only true if explicitly human-verified — NEVER auto-set to true by AI
      isVerified    : aiCertificate.verification_status === 'HUMAN_VERIFIED',
      thumbnail     : aiCertificate.thumbnail            || null,  // to be set when image is stored
      evidenceStatus: aiCertificate.verification_status  || 'PENDING',
      duration      : aiCertificate.duration             || null,
      eventName     : aiCertificate.event_name           || null
    };
  }

  /**
   * Convert an array of AI certificates to frontend shape.
   * @param {Array<Object>} aiCertificates
   * @returns {Array<FrontendCertificate>}
   */
  toFrontendArray(aiCertificates = []) {
    return aiCertificates.map((cert, i) =>
      this.toFrontend(cert, cert.id || `cert-${i + 1}`)
    );
  }

  /**
   * Convert a frontend certificate back to AI internal model
   * (for when frontend sends updates).
   * @param {Object} frontendCert
   * @returns {Object} AI-compatible certificate object
   */
  fromFrontend(frontendCert) {
    if (!frontendCert) return null;
    return {
      id                  : frontendCert.id            || null,
      certificate_title   : frontendCert.title         || null,
      organization        : frontendCert.issuer        || null,
      issuing_organization: frontendCert.issuer        || null,
      date                : frontendCert.issueDate     || null,
      category            : frontendCert.category      || null,
      credential_id       : frontendCert.credentialId  || null,
      certificate_number  : frontendCert.credentialId  || null,
      achievement         : frontendCert.grade         || null,
      description         : frontendCert.description   || null,
      skills              : (frontendCert.skills || []).map(s => ({ name: s, category: 'Skill', confidence: null, evidence: 'user-provided' })),
      verification_status : frontendCert.isVerified ? 'HUMAN_VERIFIED' : 'PENDING',
      thumbnail           : frontendCert.thumbnail     || null
    };
  }
}

module.exports = CertificateFrontendAdapter;
