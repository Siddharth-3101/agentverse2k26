/**
 * AIPortfolioGeneratorModel.js
 * Independent AI Portfolio Generation Model.
 *
 * Rules:
 *  - Uses ONLY actual input data (profile, certificates, activities, projects).
 *  - NEVER fabricates student name, org, activities, projects, or skills.
 *  - Empty arrays for certificates/activities/projects if none provided.
 *  - Grounded in evidence — integrates Ollama Local LLM with anti-hallucination guardrails.
 */

'use strict';

const EvidenceChecker = require('./EvidenceChecker');
const OllamaService   = require('./OllamaService');

class AIPortfolioGeneratorModel {
  constructor(options = {}) {
    this.evidenceChecker = new EvidenceChecker(options);
    this.ollamaService   = new OllamaService(options);
  }

  /**
   * Generate an evidence-based portfolio (Async with optional Ollama LLM narrative summary).
   */
  async generatePortfolioAsync(
    studentProfile = {},
    certificates   = [],
    activities     = [],
    projects       = [],
    publications   = []
  ) {
    const portfolioResult = this.generatePortfolio(studentProfile, certificates, activities, projects, publications);

    // Try Ollama LLM grounded summary generation if available
    try {
      const isOnline = await this.ollamaService.isAvailable();
      if (isOnline) {
        const llmSummary = await this.ollamaService.generatePortfolioSummary(studentProfile, certificates);
        if (llmSummary) {
          portfolioResult.portfolio.aiSummary = `${llmSummary} [AI-generated summary based on provided data]`;
          portfolioResult.internal.aiSummary  = portfolioResult.portfolio.aiSummary;
        }
      }
    } catch (_) {
      // Fall back silently to rule-based summary on error
    }

    return portfolioResult;
  }

  /**
   * Generate an evidence-based portfolio (Synchronous baseline).
   */
  generatePortfolio(
    studentProfile = {},
    certificates   = [],
    activities     = [],
    projects       = [],
    publications   = []
  ) {
    // ── 1. Evidence verification on certificates ─────────────────────────────
    const certificateClaims = certificates.map(c => ({
      id               : c.id || null,
      title            : c.certificate_title || c.title || c.event_name || null,
      certificate_title: c.certificate_title || null,
      event_name       : c.event_name || null,
      organization     : c.organization || c.issuing_organization || null,
      category         : c.category || null,
      date             : c.date || c.issue_date || null,
      credential_id    : c.credential_id || null,
      achievement      : c.achievement || null,
      skills           : Array.isArray(c.skills) ? c.skills : [],
      verification_status: c.verification_status || 'PENDING'
    }));

    const evidenceResult = this.evidenceChecker.verifyClaims(certificateClaims, certificates);

    // ── 2. Evidence-backed skills (from certificates only) ───────────────────
    const evidenceSkills = this.evidenceChecker.filterVerifiedSkills(certificates);

    // ── 3. Stats — count only from actual data ───────────────────────────────
    const hackathonsWon = certificates.filter(c =>
      c.category === 'Hackathon' &&
      c.achievement &&
      /winner|1st|first|champion/i.test(c.achievement)
    ).length;

    const verifiedCertificates = certificates.filter(c =>
      c.verification_status === 'HUMAN_VERIFIED'
    ).length;

    const allCertificates = certificates.length;

    const clubRole = activities.find(a =>
      /president|vice.president|lead|head|coordinator|secretary/i.test(a.role || '')
    );

    // ── 4. AI Summary — generated from actual data only ──────────────────────
    const aiSummary = this._generateSummary(studentProfile, certificates, evidenceSkills, activities);

    // ── 5. Verified achievements from evidence-checked claims ─────────────────
    const verifiedAchievements = evidenceResult.verifiedClaims
      .filter(c => c.achievement || c.category === 'Hackathon' || c.category === 'Competition')
      .map((c, i) => ({
        id          : c.id || `ach-${i + 1}`,
        title       : c.title || c.certificate_title,
        organization: c.organization || null,
        date        : c.date || null,
        badge       : this._buildBadge(c),
        description : c.description || null,
        credentialId: c.credential_id || null,
        evidenceStatus: c.evidence_status
      }));

    // ── 6. Featured projects — from actual input only ─────────────────────────
    const featuredProjects = projects.map((p, i) => ({
      id         : p.id || `proj-${i + 1}`,
      title      : p.title || null,
      description: p.description || null,
      tech       : Array.isArray(p.tech) ? p.tech : [],
      github     : p.github || null,
      demo       : p.demo || null,
      status     : p.status || 'personal'
    }));

    // ── 7. Internal AI portfolio structure ────────────────────────────────────
    const internalPortfolio = {
      student_id: studentProfile.student_id || studentProfile.roll_number || null,
      meta: {
        generated_at           : new Date().toISOString(),
        generator              : 'Campus Clubs AI Portfolio Generator',
        evidence_grounding_score: evidenceResult.stats.evidence_grounding_score,
        evidence_pass          : evidenceResult.stats.evidence_pass,
        data_source_note       : 'All claims are sourced from provided student profile and certificate data only.'
      },
      profile: {
        name       : studentProfile.name        || null,
        department : studentProfile.department  || null,
        institution: studentProfile.institution || null,
        roll_number: studentProfile.roll_number || null,
        email      : studentProfile.email       || null,
        github     : studentProfile.github      || null,
        linkedin   : studentProfile.linkedin    || null,
        batch      : studentProfile.batch       || null,
        degree     : studentProfile.degree      || null
      },
      stats: {
        hackathonsWon      : hackathonsWon,
        verifiedCertificates: verifiedCertificates,
        totalCertificates  : allCertificates,
        skillsAcquired     : evidenceSkills.length,
        clubRole           : clubRole ? (clubRole.role || null) : null
      },
      aiSummary           : aiSummary,
      skills              : evidenceSkills,
      verifiedAchievements: verifiedAchievements,
      unverifiedClaims    : evidenceResult.unverifiedClaims,
      featuredProjects    : featuredProjects,
      activities          : activities.length > 0 ? activities : [],
      publications        : publications.length > 0 ? publications : [],
      certificates        : certificates.length > 0 ? certificateClaims : []
    };

    // ── 8. Frontend adapter ───────────────────────────────────────────────────
    const frontendPortfolio = this._toFrontendShape(internalPortfolio);

    return {
      success          : true,
      portfolio        : frontendPortfolio,
      internal         : internalPortfolio,
      evidence_report  : evidenceResult.stats
    };
  }

  // ─── AI Summary ─────────────────────────────────────────────────────────────

  _generateSummary(profile, certificates, skills, activities) {
    const parts = [];

    const name       = profile.name       ? `${profile.name}` : null;
    const dept       = profile.department || null;
    const certCount  = certificates.length;
    const skillNames = skills.slice(0, 4).map(s => s.name);

    if (name && dept) {
      parts.push(`${name} is a ${dept} student`);
    } else if (name) {
      parts.push(`${name} is a student`);
    } else {
      parts.push('This student');
    }

    if (certCount > 0) {
      parts[0] += ` with ${certCount} certificate credential${certCount > 1 ? 's' : ''}`;
    }

    parts[0] += '.';

    if (skillNames.length > 0) {
      parts.push(`Evidence from certificates suggests exposure to: ${skillNames.join(', ')}.`);
    }

    const leadershipActivity = activities.find(a =>
      /president|lead|head|coordinator/i.test(a.role || '')
    );

    if (leadershipActivity) {
      parts.push(`Has demonstrated leadership as ${leadershipActivity.role} in ${leadershipActivity.club || leadershipActivity.title || 'campus activities'}.`);
    }

    if (parts.length === 0) return null;

    return parts.join(' ') + ' [AI-generated summary based on provided data]';
  }

  // ─── Achievement Badge ───────────────────────────────────────────────────────

  _buildBadge(claim) {
    const achievement = (claim.achievement || '').toLowerCase();
    if (/winner|1st|first|champion/.test(achievement)) return '🏆 Winner';
    if (/runner.up|2nd|second/.test(achievement))      return '🥈 Runner Up';
    if (/3rd|third/.test(achievement))                 return '🥉 Third Place';
    if (/finalist|top \d/.test(achievement))           return '🎯 Finalist';
    if (/distinction/.test(achievement))               return '🎓 Distinction';
    if (/participant|completed|completion/.test(achievement)) return '✅ Completed';
    if (claim.category)                                return `📋 ${claim.category}`;
    return '📄 Certificate';
  }

  // ─── Frontend Adapter ────────────────────────────────────────────────────────

  _toFrontendShape(internal) {
    const p = internal.profile;

    return {
      name      : p.name        || null,
      tagline   : p.degree && p.department ? `${p.degree} — ${p.department}` : (p.department || null),
      university: p.institution || null,
      department: p.department  || null,
      batch     : p.batch       || null,
      email     : p.email       || null,
      github    : p.github      || null,
      linkedin  : p.linkedin    || null,

      aiSummary : internal.aiSummary || null,

      stats     : {
        hackathonsWon       : internal.stats.hackathonsWon,
        verifiedCertificates: internal.stats.verifiedCertificates,
        skillsAcquired      : internal.stats.skillsAcquired,
        clubRole            : internal.stats.clubRole
      },

      skills    : internal.skills.map(s => ({
        name           : s.name,
        category       : s.category,
        evidenceCount  : s.evidence_count,
        supportedBy    : s.supporting_certificates || []
      })),

      verifiedAchievements: internal.verifiedAchievements,
      featuredProjects    : internal.featuredProjects,
      _meta               : internal.meta
    };
  }
}

module.exports = AIPortfolioGeneratorModel;
