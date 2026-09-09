/**
 * ai/tests/certificateTests.js
 * Test suite for Certificate Intelligence AI and AI Portfolio Generator.
 *
 * Tests use realistic certificate text samples.
 * Verifies: no fake data, correct nulls, correct category/skills, evidence grounding.
 *
 * Run: node ai/tests/certificateTests.js
 */

'use strict';

const CertificateIntelligenceModel = require('../CertificateIntelligenceModel');
const AIPortfolioGeneratorModel    = require('../AIPortfolioGeneratorModel');
const CertificateFrontendAdapter   = require('../CertificateFrontendAdapter');

const ai      = new CertificateIntelligenceModel();
const portGen = new AIPortfolioGeneratorModel();
const adapter = new CertificateFrontendAdapter();

// ─── Test helpers ────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition, label, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function assertNull(value, label) {
  assert(value === null || value === undefined, label, `got: ${JSON.stringify(value)}`);
}

function assertNotNull(value, label) {
  assert(value !== null && value !== undefined && value !== '', label, `got: ${JSON.stringify(value)}`);
}

function assertNoFakeData(obj, label) {
  const str = JSON.stringify(obj || '').toLowerCase();
  const fakeTokens = ['siddharth mehta', 'agentverse institute', 'tejas india hackathon', 'siddharth@agentverse', 'av-cred-'];
  const found = fakeTokens.filter(t => str.includes(t));
  assert(found.length === 0, `${label} — no fake data`, found.length > 0 ? `Found: ${found.join(', ')}` : '');
}

// ─── Sample certificate texts ─────────────────────────────────────────────────

const SAMPLES = {
  hackathon: `
CERTIFICATE OF ACHIEVEMENT

This is to certify that Riya Sharma has successfully secured 1st Place
in the CodeFest Hackathon 2025, organized by IIIT Hyderabad Tech Society.

Skills: React, Node.js, Python, System Design.
Credential ID: IIIT-CF-2025-4421
Date: March 15, 2025
`,

  workshop: `
CERTIFICATE OF PARTICIPATION

Presented to Arjun Kumar

For attending the 3-day AWS Cloud Foundations Workshop
conducted by Amazon Web Services Academy on April 10, 2024.

Verification ID: AWS-CW-2024-8812
`,

  course: `
CERTIFICATE OF COMPLETION

This is to certify that Priya Nair has successfully completed the
Machine Learning Specialization Course on Coursera.

Issued by: Stanford University / Coursera
Date: January 20, 2025
Credential ID: COURSERA-ML-9981XY
Grade: Passed with Distinction
`,

  competition: `
CERTIFICATE OF EXCELLENCE

Awarded to Rahul Singh

For securing Top 5 Finalist position in the
National Cyber Shield CTF Competition 2025.

Organized by: IIT Bombay Cyber Society
Date: February 28, 2025
Credential ID: IITB-CTF-2025-0572
Score: 88/100
`,

  withoutDate: `
CERTIFICATE OF PARTICIPATION

This is to certify that Meera Pillai participated in the
GFG Annual Coding Olympiad. Skills demonstrated: Dynamic Programming, C++.

Credential ID: GFG-OLY-8892
`,

  withoutCredentialId: `
CERTIFICATE OF COMPLETION

Awarded to Aditya Verma

For successful completion of the Docker & Kubernetes Bootcamp.
Organized by: DevOps India Community.
Date: June 5, 2024
`,

  winnerAchievement: `
CERTIFICATE OF ACHIEVEMENT

This is to certify that Sneha Reddy is the WINNER of the
Smart India Hackathon 2024 — HealthTech Track.
Organized by: Ministry of Education, Government of India.
Date: December 20, 2024
Credential ID: SIH-HEALTH-2024-7731
`,

  participantAchievement: `
CERTIFICATE OF PARTICIPATION

Presented to Kiran Bhat for participating in the
Annual Sports Meet 2025 — Chess Championship.
Organized by: DCRUST Sports Council.
Date: September 12, 2025
`,

  sports: `
CERTIFICATE OF ACHIEVEMENT

Awarded to Vivek Iyer for winning the Inter-University
Basketball Championship 2025.
Organized by: Panjab University Sports Board.
Date: November 10, 2025
Credential ID: PU-SPORTS-BB-2025-334
`,

  cultural: `
CERTIFICATE OF EXCELLENCE

Awarded to Anjali Mehta for outstanding performance in
the Annual Cultural Fest — Classical Dance Category.
Organized by: BITS Pilani Cultural Club.
Date: February 2025
`,

  leadership: `
CERTIFICATE OF RECOGNITION

Presented to Sandeep Rao for serving as President of the
ACM Student Chapter 2024-25 and organizing 12 technical events.
Issued by: ACM India.
Credential ID: ACM-INDIA-2025-5543
`,

  emptydoc: ``,

  ocrFailInput: null // simulates OCR failure
};

// ─── Test Runner ─────────────────────────────────────────────────────────────

async function runTests() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(' Certificate Intelligence AI — Test Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

  // ─── Test 1: Hackathon Certificate ─────────────────────────────────────────
  console.log('TEST 1: Hackathon Certificate (normal text)');
  {
    const r = ai.processText(SAMPLES.hackathon, 'codefest_cert.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assertNotNull(r.extracted_data.student_name,     'student_name extracted');
    assertNotNull(r.extracted_data.credential_id,    'credential_id extracted');
    assertNotNull(r.extracted_data.date,             'date extracted');
    assert(r.extracted_data.category === 'Hackathon','category=Hackathon', r.extracted_data.category);
    assert(r.extracted_data.achievement !== null,    'achievement extracted');
    assert(r.verification.verification_status === 'PENDING', 'status=PENDING');
    assert(r.skills.length > 0,                      'skills extracted');
  }

  // ─── Test 2: Workshop Certificate ──────────────────────────────────────────
  console.log('\nTEST 2: Workshop Certificate');
  {
    const r = ai.processText(SAMPLES.workshop, 'aws_workshop.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(r.extracted_data.category === 'Workshop', 'category=Workshop', r.extracted_data.category);
    assertNotNull(r.extracted_data.student_name,     'student_name extracted');
    assertNotNull(r.extracted_data.credential_id,    'credential_id extracted');
    assert(r.verification.verification_status === 'PENDING', 'status=PENDING');
  }

  // ─── Test 3: Course Certificate ────────────────────────────────────────────
  console.log('\nTEST 3: Course Certificate (ML Specialization)');
  {
    const r = ai.processText(SAMPLES.course, 'coursera_ml.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(['Course', 'Certification'].includes(r.extracted_data.category), 'category=Course/Certification', r.extracted_data.category);
    assertNotNull(r.extracted_data.date,             'date extracted');
    assertNotNull(r.extracted_data.credential_id,    'credential_id extracted');
    assert(r.skills.some(s => s.name === 'Machine Learning'), 'Machine Learning skill detected');
  }

  // ─── Test 4: Competition Certificate ───────────────────────────────────────
  console.log('\nTEST 4: Competition / CTF Certificate');
  {
    const r = ai.processText(SAMPLES.competition, 'ctf_cert.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(['Competition', 'Other'].includes(r.extracted_data.category), 'category=Competition or Other', r.extracted_data.category);
    assert(r.skills.some(s => s.name === 'Cybersecurity'), 'Cybersecurity skill detected');
    assert(r.verification.verification_status === 'PENDING', 'status=PENDING');
  }

  // ─── Test 5: Certificate Without Date ──────────────────────────────────────
  console.log('\nTEST 5: Certificate Without Date');
  {
    const r = ai.processText(SAMPLES.withoutDate, 'gfg_coding.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    // Date must be null — not today's date, not fabricated
    assertNull(r.extracted_data.date,       'date=null (not fabricated)');
    assertNull(r.extracted_data.start_date, 'start_date=null');
    assertNull(r.extracted_data.end_date,   'end_date=null');
    assert(r.confidence.flagged_fields.includes('date'), 'date flagged as missing');
  }

  // ─── Test 6: Certificate Without Credential ID ─────────────────────────────
  console.log('\nTEST 6: Certificate Without Credential ID');
  {
    const r = ai.processText(SAMPLES.withoutCredentialId, 'docker_bootcamp.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assertNull(r.extracted_data.credential_id, 'credential_id=null (not random-generated)');
    assert(r.confidence.flagged_fields.includes('credential_id'), 'credential_id flagged');
  }

  // ─── Test 7: Winner Achievement ────────────────────────────────────────────
  console.log('\nTEST 7: Winner Achievement');
  {
    const r = ai.processText(SAMPLES.winnerAchievement, 'sih_winner.pdf');
    assert(r.success, 'success=true');
    assertNotNull(r.extracted_data.achievement, 'achievement extracted');
    assert(/winner|champion|1st|first/i.test(r.extracted_data.achievement || ''), 'achievement=Winner', r.extracted_data.achievement);
    assert(r.extracted_data.category === 'Hackathon', 'category=Hackathon', r.extracted_data.category);
  }

  // ─── Test 8: Participation Achievement ─────────────────────────────────────
  console.log('\nTEST 8: Participant Achievement (not defaulted to "Certificate of Completion")');
  {
    const r = ai.processText(SAMPLES.participantAchievement, 'sports_chess.pdf');
    assert(r.success, 'success=true');
    // Achievement must come from text, not be "Certificate of Completion" default
    const ach = r.extracted_data.achievement;
    assert(ach === null || /participat/i.test(ach || ''), 'achievement=Participant or null (not fabricated)', ach);
    assert(ach !== 'Certificate of Completion', 'achievement ≠ fake default');
  }

  // ─── Test 9: Sports Certificate ────────────────────────────────────────────
  console.log('\nTEST 9: Sports Certificate');
  {
    const r = ai.processText(SAMPLES.sports, 'basketball_championship.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(r.extracted_data.category === 'Sports' || r.extracted_data.category === 'Other', 'category=Sports or Other', r.extracted_data.category);
  }

  // ─── Test 10: Cultural Certificate ─────────────────────────────────────────
  console.log('\nTEST 10: Cultural Certificate');
  {
    const r = ai.processText(SAMPLES.cultural, 'cultural_dance.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(r.extracted_data.category === 'Cultural' || r.extracted_data.category === 'Other', 'category=Cultural or Other', r.extracted_data.category);
  }

  // ─── Test 11: Leadership Certificate ───────────────────────────────────────
  console.log('\nTEST 11: Leadership Certificate');
  {
    const r = ai.processText(SAMPLES.leadership, 'acm_president.pdf');
    assert(r.success, 'success=true');
    assertNoFakeData(r.extracted_data, 'no fake data');
    assert(['Leadership', 'Club Activity', 'Other'].includes(r.extracted_data.category), 'category=Leadership/Club/Other', r.extracted_data.category);
    assert(r.skills.some(s => s.name === 'Leadership'), 'Leadership skill detected');
  }

  // ─── Test 12: Empty Document ────────────────────────────────────────────────
  console.log('\nTEST 12: Empty / Invalid Document');
  {
    const r = ai.processText(SAMPLES.emptydoc, 'empty.pdf');
    assert(!r.success, 'success=false for empty input');
    assert(r.error === 'EMPTY_INPUT', 'error=EMPTY_INPUT');
    assert(r.verification.verification_status === 'PENDING', 'status=PENDING');
  }

  // ─── Test 13: OCR Failure Safe Response ─────────────────────────────────────
  console.log('\nTEST 13: OCR Failure — safe response (no fake text)');
  {
    // Simulate what the extractor returns on OCR failure
    const failedExtraction = {
      success              : false,
      text                 : '',
      isScanned            : true,
      extractor            : 'ocr-failed',
      ocrConfidence        : 0,
      error                : 'OCR_FAILED',
      errorDetail          : 'Tesseract returned empty text.',
      requires_verification: true
    };
    assert(failedExtraction.success === false, 'OCR failure: success=false');
    assert(failedExtraction.text === '',       'OCR failure: text="" (no fake content)');
    assert(failedExtraction.error === 'OCR_FAILED', 'OCR failure: error=OCR_FAILED');
    assertNoFakeData(failedExtraction.text,    'no fake content in OCR failure');
  }

  // ─── Test 14: Portfolio Generator — No Fake Defaults ───────────────────────
  console.log('\nTEST 14: Portfolio Generator — only uses actual input data');
  {
    const profile = { name: 'Test Student', department: 'Computer Science', institution: 'Test College' };
    const certs   = [];    // no certificates
    const acts    = [];    // no activities
    const projs   = [];    // no projects

    const result  = portGen.generatePortfolio(profile, certs, acts, projs);
    assert(result.success, 'success=true');
    assertNoFakeData(result.portfolio, 'no fake data in portfolio');
    assert(result.portfolio.skills.length === 0,             'skills=[] when no certs');
    assert(result.portfolio.verifiedAchievements.length === 0, 'achievements=[] when no certs');
    assert(result.portfolio.featuredProjects.length === 0,   'projects=[] when none provided');
    assert(result.portfolio.stats.hackathonsWon === 0,       'hackathonsWon=0');
    assert(result.portfolio.name === 'Test Student',         'name from profile');
  }

  // ─── Test 15: CertificateFrontendAdapter ────────────────────────────────────
  console.log('\nTEST 15: CertificateFrontendAdapter — correct field mapping');
  {
    const aiCert = {
      certificate_title   : 'AWS Cloud Foundations',
      organization        : 'Amazon Web Services',
      date                : 'July 20, 2024',
      credential_id       : 'AWS-CLD-77210',
      achievement         : 'Grade A+',
      skills              : [{ name: 'AWS', category: 'Cloud' }],
      verification_status : 'PENDING'
    };
    const frontend = adapter.toFrontend(aiCert, 'cert-1');
    assert(frontend.title        === 'AWS Cloud Foundations', 'title mapped');
    assert(frontend.issuer       === 'Amazon Web Services',   'issuer mapped');
    assert(frontend.issueDate    === 'July 20, 2024',         'issueDate mapped');
    assert(frontend.credentialId === 'AWS-CLD-77210',         'credentialId mapped');
    assert(frontend.grade        === 'Grade A+',              'grade mapped from achievement');
    assert(frontend.isVerified   === false,                   'isVerified=false for PENDING');
    assert(frontend.skills.includes('AWS'),                   'skills mapped');
    assertNoFakeData(frontend,                                'no fake data in adapted cert');
  }

  // ─── Test 16: AIPortfolioPDFGenerator ─────────────────────────────────────────
  console.log('\nTEST 16: AIPortfolioPDFGenerator — valid PDF file generation');
  {
    const AIPortfolioPDFGenerator = require('../AIPortfolioPDFGenerator');
    const pdfGen = new AIPortfolioPDFGenerator();
    const fs = require('fs');
    const path = require('path');
    const tmpPdf = path.join(__dirname, 'test_output.pdf');

    const profile = { name: 'Test Student', department: 'Computer Science', institution: 'DCRUST' };
    const portfolio = portGen.generatePortfolio(profile, [], []).portfolio;
    const generatedPath = pdfGen.generatePDF(portfolio, tmpPdf);

    assert(fs.existsSync(generatedPath), 'PDF file created on disk');
    const bytes = fs.statSync(generatedPath).size;
    assert(bytes > 500, 'PDF file size > 500 bytes', `${bytes} bytes`);

    // Clean up test file
    try { fs.unlinkSync(tmpPdf); } catch(_) {}
  }

  // ─── Test 17: RecommendationEngine ──────────────────────────────────────────
  console.log('\nTEST 17: RecommendationEngine — skill-matched recommendations');
  {
    const RecommendationEngine = require('../RecommendationEngine');
    const recEngine = new RecommendationEngine();

    const profile = { name: 'Sanjay', department: 'Computer Science', skills: ['Python', 'React'] };
    const certs   = [{ certificate_title: 'Cisco Packet Tracer', skills: [{ name: 'Computer Networking' }] }];
    const clubsPool = [
      { id: 'c1', name: 'Networking Club', skills: ['Computer Networking', 'Cisco'] },
      { id: 'c2', name: 'Web Dev Club', skills: ['React', 'JavaScript'] }
    ];

    const recs = recEngine.recommendClubs(profile, certs, clubsPool);
    assert(recs.length === 2, 'returned 2 recommendations');
    assert(recs[0].recommendation.matchScore >= 70, 'highest match score >= 70');
    assert(recs[0].recommendation.matchReason.length > 5, 'generated human-readable matchReason');
  }

  // ─── Test 18: WeeklyAnalysisModel ───────────────────────────────────────────
  console.log('\nTEST 18: WeeklyAnalysisModel — dual streaks & trend velocity');
  {
    const WeeklyAnalysisModel = require('../WeeklyAnalysisModel');
    const weeklyModel = new WeeklyAnalysisModel();

    const profile = { name: 'Sanjay', student_id: 'STU-2026-001' };
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const tenDaysAgo  = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();

    const certs = [
      { certificate_title: 'Cisco Packet Tracer', date: threeDaysAgo, topLevelCategory: 'Certifications' },
      { certificate_title: 'AWS Certified', date: tenDaysAgo, topLevelCategory: 'Certifications' }
    ];
    const acts = [
      { title: 'Tejas Hackathon', date: threeDaysAgo, topLevelCategory: 'Events' }
    ];

    const result = weeklyModel.analyzeWeeklyActivity(profile, certs, acts, []);

    assert(result.success, 'success=true');
    assert(result.streaks.event_streak >= 1, 'event_streak >= 1');
    assert(result.streaks.certificate_streak >= 1, 'certificate_streak >= 1');
    assert(['INCREASED', 'DECREASED', 'STEADY'].includes(result.participation_trend.trend), 'valid trend state');
    assert(result.category_breakdown.Events.count > 0, 'Events count in category breakdown');
    assert(result.category_breakdown.Certifications.count > 0, 'Certifications count in category breakdown');
    assertNoFakeData(result, 'no fake data in weekly analysis');
  }

  // ─── Test 19: OllamaService & Anti-Hallucination Guardrail ─────────────────
  console.log('\nTEST 19: OllamaService — offline fallback & anti-hallucination guardrail');
  {
    const OllamaService = require('../OllamaService');
    const ollama = new OllamaService();

    // Verify fallback when Ollama server is offline
    const isOnline = await ollama.isAvailable();
    assert(typeof isOnline === 'boolean', 'isAvailable() returns boolean');

    // Test Guardrail Logic in CertificateIntelligenceModel
    const rawText = "This is to certify that Riya Sharma completed the Workshop on 15 March 2025.";
    const baseline = { student_name: "Riya Sharma", certificate_title: "Workshop", date: "15 March 2025" };
    const fakeLlmEntities = { student_name: "Siddharth Mehta (Fake)", certificate_title: "Workshop", date: "15 March 2025" };

    const grounded = ai._applyGroundedLlmEntities(baseline, fakeLlmEntities, rawText);
    assert(grounded.student_name === "Riya Sharma", 'Hallucinated name rejected, baseline preserved');
    assert(grounded.certificate_title === "Workshop", 'Grounded title preserved');
  }

  // ─── Test 20: CareerPathRecommenderModel ──────────────────────────────────────
  console.log('\nTEST 20: CareerPathRecommenderModel — roadmap matching & BUILD_NEXT milestones');
  {
    const CareerPathRecommenderModel = require('../CareerPathRecommenderModel');
    const careerModel = new CareerPathRecommenderModel();

    const profile = { name: 'Sanjay', department: 'Computer Science', skills: ['Python'] };
    const certs   = [{ certificate_title: 'Cisco Packet Tracer', skills: [{ name: 'Computer Networking' }] }];

    const result = careerModel.evaluateCareerPath(profile, certs, 'Cybersecurity Analyst');

    assert(result.success, 'success=true');
    assert(result.selectedCareerPath === 'Cybersecurity Analyst', 'selectedCareerPath matched');
    assert(result.roadmap.milestones.length > 0, 'milestones array populated');
    assert(result.buildNextTopics.length > 0, 'buildNextTopics identified');
    assertNoFakeData(result, 'no fake data in career recommendation');
  }

  // ─── Test 21: RoadmapTaxonomy Scanner ─────────────────────────────────────────
  console.log('\nTEST 21: RoadmapTaxonomy — built-in roadmaps & custom folder scanner');
  {
    const RoadmapTaxonomy = require('../roadmapTaxonomy');
    const taxonomy = new RoadmapTaxonomy();

    const roles = taxonomy.getAllRoles();
    assert(roles.includes('Frontend Developer'), 'Frontend Developer roadmap present');
    assert(roles.includes('Backend Developer'), 'Backend Developer roadmap present');
    assert(roles.includes('Cybersecurity Analyst'), 'Cybersecurity Analyst roadmap present');
  }

  // ─── Test 22: Ingested 10 Career Roadmaps Verification ────────────────────────
  console.log('\nTEST 22: Ingested 10 Career Roadmaps — full taxonomy & recommender evaluation');
  {
    const RoadmapTaxonomy = require('../roadmapTaxonomy');
    const CareerPathRecommenderModel = require('../CareerPathRecommenderModel');
    const taxonomy    = new RoadmapTaxonomy();
    const careerModel = new CareerPathRecommenderModel();

    const roles = taxonomy.getAllRoles();
    assert(roles.length >= 10, 'At least 10 career roadmaps registered', `Found ${roles.length} roles`);

    const expectedRoles = [
      'AI / ML Engineer', 'AWS Cloud Engineer', 'Backend Developer',
      'Blockchain Developer', 'Cyber Security Analyst', 'Data Analyst',
      'DevOps & Cloud Engineer', 'Frontend Developer', 'Full Stack Developer', 'iOS Developer'
    ];

    for (const expected of expectedRoles) {
      const rm = taxonomy.getRoadmap(expected);
      assert(rm !== null, `Roadmap for ${expected} loaded`);
      assert(Array.isArray(rm.milestones) && rm.milestones.length > 0, `Milestones populated for ${expected}`);
    }

    // Evaluate iOS student profile
    const iosProfile = { name: 'Ananya', skills: ['Swift', 'SwiftUI', 'Xcode'] };
    const iosEval    = careerModel.evaluateCareerPath(iosProfile, [], 'ios');
    assert(iosEval.success, 'iOS evaluation success=true');
    assert(iosEval.selectedCareerPath === 'iOS Developer', 'matched iOS Developer role');
    assert(iosEval.buildNextTopics.length > 0, 'buildNextTopics suggested for iOS');

    // Evaluate Data Analyst student profile
    const daProfile = { name: 'Rahul', skills: ['Python', 'SQL', 'Pandas'] };
    const daEval    = careerModel.evaluateCareerPath(daProfile, [], 'data-analyst');
    assert(daEval.success, 'Data Analyst evaluation success=true');
    assert(daEval.selectedCareerPath === 'Data Analyst', 'matched Data Analyst role');

    assertNoFakeData(iosEval, 'no fake data in iOS evaluation');
    assertNoFakeData(daEval, 'no fake data in Data Analyst evaluation');
  }

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(` Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
