/**
 * CareerPathRecommenderModel.js
 * Independent AI Career Path Recommender & Skill Progression Engine.
 *
 * Rules:
 *  - Matches student's verified skills & profile against roadmap.sh-style career trees.
 *  - Uses qualitative milestone progression: COMPLETED, BUILD_NEXT, UPCOMING (NO % bars).
 *  - Supports user-selected career paths & automatic AI recommendations.
 *  - Enforces strict data grounding (zero fake data/hallucinated credentials).
 */

'use strict';

const RoadmapTaxonomy = require('./roadmapTaxonomy');
const OllamaService   = require('./OllamaService');

class CareerPathRecommenderModel {
  constructor(options = {}) {
    this.taxonomy      = new RoadmapTaxonomy();
    this.ollamaService = new OllamaService(options);
  }

  /**
   * Recommend matching career paths and generate skill progression for a targeted role.
   * @param {Object} studentProfile     - Student profile info { name, department, skills[] }
   * @param {Array}  studentCertificates - Verified/extracted certificates
   * @param {string} selectedRole       - Optional explicit target role chosen by student
   * @returns {Object} Career Recommendation & Skill Progression JSON
   */
  evaluateCareerPath(studentProfile = {}, studentCertificates = [], selectedRole = null) {
    this.taxonomy.scanCustomCareerFolder(); // Reload any new career maps added to career/

    const allRoadmaps      = this.taxonomy.getAllRoadmaps();
    const studentSkillMap  = this._buildStudentSkillMap(studentProfile, studentCertificates);

    // 1. Score all available career paths
    const scoredPathways = [];
    for (const [roleName, roadmap] of Object.entries(allRoadmaps)) {
      const scoreData = this._scoreRoadmapMatch(roadmap, studentSkillMap, studentProfile);
      scoredPathways.push({
        role       : roleName,
        category   : roadmap.category,
        description: roadmap.description,
        matchScore : scoreData.score,
        matchedSkills: scoreData.matchedSkills
      });
    }

    // Sort pathways descending by matchScore
    scoredPathways.sort((a, b) => b.matchScore - a.matchScore);

    // 2. Determine targeted role (either user selected or top AI recommendation)
    let targetedRoadmap = selectedRole ? this.taxonomy.getRoadmap(selectedRole) : null;
    if (!targetedRoadmap) {
      const topRoleName = scoredPathways.length > 0 ? scoredPathways[0].role : 'Backend Developer';
      targetedRoadmap = allRoadmaps[topRoleName] || this.taxonomy.getRoadmap(topRoleName);
    }
    const targetRoleName = targetedRoadmap.role;

    // 3. Analyze milestone progression for targeted role (COMPLETED / BUILD_NEXT / UPCOMING)
    const progressionData = this._analyzeRoleProgression(targetedRoadmap, studentSkillMap);

    // 4. Grounded Summary
    const summary = this._generateSummary(studentProfile, targetRoleName, progressionData);

    return {
      success             : true,
      studentId           : studentProfile.student_id || studentProfile.roll_number || null,
      selectedCareerPath  : targetRoleName,
      matchScore          : progressionData.matchScore,
      summary             : summary,
      roadmap: {
        role              : targetedRoadmap.role,
        category          : targetedRoadmap.category,
        description       : targetedRoadmap.description,
        milestones        : progressionData.milestones
      },
      buildNextTopics     : progressionData.buildNextTopics,
      recommendedPathways : scoredPathways.map(p => ({
        role              : p.role,
        category          : p.category,
        matchScore        : p.matchScore,
        matchedSkillsCount: p.matchedSkills.length
      }))
    };
  }

  // ─── Scoring Engine ──────────────────────────────────────────────────────────

  _scoreRoadmapMatch(roadmap, studentSkillMap, profile) {
    const matchedSkills = [];
    let totalScore = 40; // Base baseline score

    for (const m of roadmap.milestones) {
      for (const skill of m.skills) {
        const key = skill.toLowerCase();
        if (studentSkillMap.has(key)) {
          if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
          totalScore += 12; // +12 points per matching skill
        }
      }
    }

    // Department match bonus
    if (profile.department && profile.department.toLowerCase().includes(roadmap.category.toLowerCase())) {
      totalScore += 15;
    }

    const finalScore = Math.min(98, Math.max(45, totalScore));
    return { score: finalScore, matchedSkills };
  }

  // ─── Qualitative Progression Analyzer (No Percentages) ───────────────────────

  _analyzeRoleProgression(roadmap, studentSkillMap) {
    const milestones      = [];
    const buildNextTopics = [];
    let hasFoundBuildNext = false;
    let completedCount    = 0;

    for (const m of roadmap.milestones) {
      const topicSkills = m.skills || [];
      const evidence    = [];

      for (const s of topicSkills) {
        const key = s.toLowerCase();
        if (studentSkillMap.has(key)) {
          const item = studentSkillMap.get(key);
          evidence.push(item.supportingCert ? `${s} (${item.supportingCert})` : s);
        }
      }

      let status     = 'UPCOMING';
      let suggestion = null;

      if (evidence.length > 0) {
        status = 'COMPLETED';
        completedCount++;
      } else if (!hasFoundBuildNext) {
        status            = 'BUILD_NEXT';
        hasFoundBuildNext = true;
        suggestion        = `Recommended Next Step: Build exposure in ${m.topic} (${topicSkills.slice(0, 3).join(', ')})`;
        buildNextTopics.push(...topicSkills);
      }

      milestones.push({
        id        : m.id,
        topic     : m.topic,
        status    : status, // COMPLETED | BUILD_NEXT | UPCOMING
        phase     : m.phase,
        skills    : topicSkills,
        evidence  : evidence.length > 0 ? evidence : null,
        suggestion: suggestion
      });
    }

    const matchScore = Number(Math.min(98, Math.max(50, (completedCount / roadmap.milestones.length) * 100)).toFixed(0));

    return {
      milestones,
      buildNextTopics,
      matchScore
    };
  }

  // ─── Summary Generator ───────────────────────────────────────────────────────

  _generateSummary(profile, roleName, progression) {
    const name = profile.name || 'This student';
    const nextTopic = progression.buildNextTopics.length > 0 ? progression.buildNextTopics[0] : null;

    if (nextTopic) {
      return `${name} is progressing on the ${roleName} roadmap. Recommended next step: gain practical exposure in ${nextTopic}. [AI-generated roadmap progression]`;
    }
    return `${name} has demonstrated strong milestone alignment across the ${roleName} career path. [AI-generated roadmap progression]`;
  }

  // ─── Skill Map Helper ────────────────────────────────────────────────────────

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

module.exports = CareerPathRecommenderModel;
