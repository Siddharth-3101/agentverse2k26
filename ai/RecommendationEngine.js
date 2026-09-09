/**
 * RecommendationEngine.js
 * Independent AI Recommendation & Filtering Engine for Clubs & Events.
 *
 * Takes the existing pool of available campus clubs & upcoming events,
 * matches them against student profile data & verified certificate skills,
 * filters low-relevance items, and returns the original items enriched with AI match metadata:
 *   - matchScore (0–98%)
 *   - matchedSkills (Array of matching skills)
 *   - matchReason (Human-readable explanation)
 *   - isRecommended (Boolean flag)
 */

'use strict';

class RecommendationEngine {
  recommendClubs(studentProfile = {}, studentCertificates = [], availableClubs = [], options = {}) {
    return this.filterAndRankClubs(studentProfile, studentCertificates, availableClubs, options);
  }

  recommendEvents(studentProfile = {}, studentCertificates = [], availableEvents = [], options = {}) {
    return this.filterAndRankEvents(studentProfile, studentCertificates, availableEvents, options);
  }

  /**
   * Filter & rank available clubs based on student profile and certificate evidence.
   * @param {Object} studentProfile     - Student profile info { name, department, skills[] }
   * @param {Array}  studentCertificates - Verified/extracted certificates
   * @param {Array}  availableClubs      - Array of existing club objects
   * @param {Object} options             - { minMatchScore: 50, topK: 10 }
   * @returns {Array<Object>} Original club objects enriched with recommendation metadata, sorted by matchScore
   */
  filterAndRankClubs(studentProfile = {}, studentCertificates = [], availableClubs = [], options = {}) {
    if (!availableClubs || availableClubs.length === 0) return [];

    const minScore = options.minMatchScore || 50;
    const topK     = options.topK || 20;

    const studentSkillMap = this._buildStudentSkillMap(studentProfile, studentCertificates);

    const rankedClubs = availableClubs.map((club) => {
      // 1. Gather all tags & skills from club object
      const clubSkills = [
        ...(Array.isArray(club.skills) ? club.skills : []),
        ...(Array.isArray(club.tags) ? club.tags : []),
        ...(club.category ? [club.category] : [])
      ];

      const matchedSkills   = [];
      let totalMatchScore   = 0;
      let topEvidenceCert   = null;

      for (const item of clubSkills) {
        const key = String(item).toLowerCase();
        if (studentSkillMap.has(key)) {
          if (!matchedSkills.includes(item)) matchedSkills.push(item);

          const skillData = studentSkillMap.get(key);
          totalMatchScore += 25;

          if (skillData.supportingCert && !topEvidenceCert) {
            topEvidenceCert = skillData.supportingCert;
          }
        }
      }

      // Career Roadmap Alignment Bonus (+30 points)
      let roadmapBonusTopic = null;
      if (Array.isArray(options.buildNextTopics)) {
        for (const topic of options.buildNextTopics) {
          const topicKey = String(topic).toLowerCase();
          if (clubSkills.some(s => String(s).toLowerCase().includes(topicKey) || topicKey.includes(String(s).toLowerCase()))) {
            totalMatchScore += 30;
            roadmapBonusTopic = topic;
            break;
          }
        }
      }

      // Final match score calculation
      const rawScore   = 50 + totalMatchScore;
      const finalScore = Math.min(98, Math.max(50, rawScore));

      // Build human-readable match reason
      let matchReason = '';
      if (roadmapBonusTopic) {
        matchReason = `Recommended for your ${options.targetRole || 'targeted'} career path (Builds next topic: ${roadmapBonusTopic}).`;
      } else if (topEvidenceCert) {
        matchReason = `Matched with your verified "${topEvidenceCert}" certificate.`;
      } else if (matchedSkills.length > 0) {
        matchReason = `Matched with your background in ${matchedSkills.slice(0, 2).join(' & ')}.`;
      } else {
        matchReason = `Recommended for ${studentProfile.department || 'engineering'} students.`;
      }

      // Return exact original club object enriched with AI recommendation metadata
      return {
        ...club,
        recommendation: {
          isRecommended : finalScore >= minScore,
          matchScore    : finalScore,
          matchedSkills : matchedSkills,
          matchReason   : matchReason,
          topLevelCategory: 'Events'
        }
      };
    });

    // Filter out low scores & sort descending by matchScore
    return rankedClubs
      .filter((c) => c.recommendation.matchScore >= minScore)
      .sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore)
      .slice(0, topK);
  }

  /**
   * Filter & rank available events based on student profile and certificate evidence.
   * @param {Object} studentProfile
   * @param {Array}  studentCertificates
   * @param {Array}  availableEvents
   * @param {Object} options
   * @returns {Array<Object>} Original event objects enriched with recommendation metadata
   */
  filterAndRankEvents(studentProfile = {}, studentCertificates = [], availableEvents = [], options = {}) {
    if (!availableEvents || availableEvents.length === 0) return [];

    const minScore = options.minMatchScore || 50;
    const topK     = options.topK || 20;

    const studentSkillMap = this._buildStudentSkillMap(studentProfile, studentCertificates);

    const rankedEvents = availableEvents.map((event) => {
      const eventTags = [
        ...(Array.isArray(event.tags) ? event.tags : []),
        ...(Array.isArray(event.eligibility) ? event.eligibility : []),
        ...(event.category ? [event.category] : [])
      ];

      const matchedSkills = [];
      let score           = 50;
      let certMatch       = null;

      for (const tag of eventTags) {
        const key = String(tag).toLowerCase();
        if (studentSkillMap.has(key)) {
          if (!matchedSkills.includes(tag)) matchedSkills.push(tag);
          score += 20;
          const data = studentSkillMap.get(key);
          if (data.supportingCert) certMatch = data.supportingCert;
        }
      }

      const finalScore  = Math.min(99, Math.max(55, score));
      const matchReason = certMatch
        ? `Matched with your verified "${certMatch}" credential.`
        : matchedSkills.length > 0
        ? `Matches your skills in ${matchedSkills.join(', ')}.`
        : `Recommended opportunity for ${studentProfile.department || 'students'}.`;

      return {
        ...event,
        recommendation: {
          isRecommended : finalScore >= minScore,
          matchScore    : finalScore,
          matchedSkills : matchedSkills,
          matchReason   : matchReason
        }
      };
    });

    return rankedEvents
      .filter((e) => e.recommendation.matchScore >= minScore)
      .sort((a, b) => b.recommendation.matchScore - a.recommendation.matchScore)
      .slice(0, topK);
  }

  // ─── Helper ──────────────────────────────────────────────────────────────────

  _buildStudentSkillMap(profile, certificates) {
    const map = new Map();

    if (Array.isArray(profile.skills)) {
      for (const s of profile.skills) {
        const name = typeof s === 'string' ? s : (s && s.name);
        if (name) map.set(name.toLowerCase(), { name, supportingCert: null });
      }
    }

    if (Array.isArray(certificates)) {
      for (const cert of certificates) {
        const certTitle  = cert.certificate_title || cert.title || cert.event_name || 'Certificate';
        const certSkills = Array.isArray(cert.skills) ? cert.skills : [];

        for (const s of certSkills) {
          const skillName = typeof s === 'string' ? s : (s && s.name);
          if (skillName) {
            map.set(skillName.toLowerCase(), { name: skillName, supportingCert: certTitle });
          }
        }
      }
    }

    return map;
  }
}

module.exports = RecommendationEngine;
