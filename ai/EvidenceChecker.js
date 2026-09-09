/**
 * EvidenceChecker.js
 * Independent Evidence-Backed Claim Verification Engine.
 *
 * Ensures portfolio claims are grounded in actual input data.
 * NEVER fabricates evidence or promotes unverified claims as verified.
 *
 * Evidence statuses:
 *   VERIFIED        - matched against a stored verified certificate record
 *   PARTIAL_EVIDENCE- matched but certificate is still PENDING AI verification
 *   UNVERIFIED      - no matching evidence found (self-reported or missing)
 */

'use strict';

class EvidenceChecker {
  /**
   * Cross-reference portfolio claims against verified certificate records.
   * @param {Array<Object>} claims              - Claims to verify
   * @param {Array<Object>} databaseCertificates - Student's stored certificates
   * @returns {{ verifiedClaims, unverifiedClaims, allClaims, stats }}
   */
  verifyClaims(claims = [], databaseCertificates = []) {
    const verifiedClaims   = [];
    const unverifiedClaims = [];

    // Build lookup map from stored certificates
    const certMap = new Map();
    for (const cert of databaseCertificates) {
      const titleKey = (cert.certificate_title || cert.title || cert.event_name || '').toLowerCase().trim();
      if (titleKey) certMap.set(titleKey, cert);

      if (cert.credential_id) {
        certMap.set(cert.credential_id.toLowerCase().trim(), cert);
      }
    }

    for (const claim of claims) {
      const claimTitle  = (claim.certificate_title || claim.title || claim.name || '').toLowerCase().trim();
      const claimCredId = (claim.credential_id || '').toLowerCase().trim();

      let matchedEvidence = null;

      // 1. Exact credential ID match (most reliable)
      if (claimCredId && certMap.has(claimCredId)) {
        matchedEvidence = certMap.get(claimCredId);
      }
      // 2. Exact title match
      else if (claimTitle && certMap.has(claimTitle)) {
        matchedEvidence = certMap.get(claimTitle);
      }
      // 3. Soft substring match (partial title overlap)
      else {
        for (const [key, cert] of certMap.entries()) {
          if (claimTitle.length >= 6 && (key.includes(claimTitle) || claimTitle.includes(key))) {
            matchedEvidence = cert;
            break;
          }
        }
      }

      if (matchedEvidence) {
        // Check if the matched certificate is itself verified by a human or just AI-extracted
        const isHumanVerified = matchedEvidence.verification_status === 'HUMAN_VERIFIED';
        const isAiExtracted   = matchedEvidence.verification_status === 'PENDING' || matchedEvidence.verification_status === 'AI_EXTRACTED';

        verifiedClaims.push({
          ...claim,
          evidence_status     : isHumanVerified ? 'VERIFIED' : 'PARTIAL_EVIDENCE',
          verification_source : isHumanVerified ? 'Human-verified certificate record' : 'AI-extracted certificate (PENDING human verification)',
          evidence_confidence : isHumanVerified ? 0.95 : 0.70,
          evidence_metadata   : {
            certificate_id     : matchedEvidence.id || null,
            issuing_organization: matchedEvidence.organization || matchedEvidence.issuing_organization || null,
            issue_date         : matchedEvidence.date || null,
            matched_by         : claimCredId && certMap.has(claimCredId) ? 'credential_id' : 'title'
          }
        });
      } else {
        // No matching evidence found — mark UNVERIFIED, never promote as verified
        unverifiedClaims.push({
          ...claim,
          evidence_status    : 'UNVERIFIED',
          verification_source: 'No matching certificate or campus record found',
          evidence_confidence: 0.0,
          warning            : 'This claim has no supporting verified evidence. Remove or ask student to upload supporting certificate.'
        });
      }
    }

    const total              = claims.length;
    const verifiedCount      = verifiedClaims.length;
    const unverifiedCount    = unverifiedClaims.length;
    const groundingScore     = total > 0
      ? Number((verifiedClaims.reduce((s, c) => s + c.evidence_confidence, 0) / total).toFixed(2))
      : 1.0;

    return {
      verifiedClaims,
      unverifiedClaims,
      allClaims: [...verifiedClaims, ...unverifiedClaims],
      stats: {
        total_claims          : total,
        verified_count        : verifiedCount,
        unverified_count      : unverifiedCount,
        evidence_grounding_score: groundingScore,
        // Passes if all claims have evidence, or ≥70% are verified
        evidence_pass         : unverifiedCount === 0 || (verifiedCount / (total || 1)) >= 0.70
      }
    };
  }

  /**
   * Build evidence-backed skill list from student's certificates.
   * Each skill lists which certificates provide evidence for it.
   * Skills are only included if at least one certificate mentions them.
   *
   * @param {Array<Object>} certificates - Student's certificates (each may have skills[])
   * @returns {Array<{ name, category, evidence_count, supporting_certificates }>}
   */
  filterVerifiedSkills(certificates = []) {
    const skillEvidenceMap = new Map();

    for (const cert of certificates) {
      const certTitle  = cert.certificate_title || cert.event_name || cert.title || 'Certificate';
      const certSkills = Array.isArray(cert.skills) ? cert.skills : [];

      for (const s of certSkills) {
        const skillName = typeof s === 'string' ? s : (s && s.name);
        if (!skillName) continue;

        const key = skillName.toLowerCase();
        if (!skillEvidenceMap.has(key)) {
          skillEvidenceMap.set(key, {
            name                  : skillName,
            category              : (s && s.category) || 'Skill',
            evidence_count        : 0,
            supporting_certificates: []
          });
        }

        const entry = skillEvidenceMap.get(key);
        entry.evidence_count += 1;
        if (!entry.supporting_certificates.includes(certTitle)) {
          entry.supporting_certificates.push(certTitle);
        }
      }
    }

    return Array.from(skillEvidenceMap.values());
  }
}

module.exports = EvidenceChecker;
