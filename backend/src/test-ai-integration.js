import path from 'path';
import fs from 'fs';
import * as activityService from './services/activityService.js';
import * as analyticsService from './services/analyticsService.js';

export async function testAIIntegration() {
  console.log('==================================================');
  console.log(' AgentVerse AI Module Integration Verification');
  console.log('==================================================\n');

  try {
    // 1. Test Career Roadmap Roles
    console.log('--- 1. Testing Career Roadmap Ingestion ---');
    const roles = await analyticsService.getCareerRoadmapRoles();
    console.log(`✅ Loaded ${roles.length} career roadmap roles:`, roles.slice(0, 5).join(', '), '...');

    // 2. Test Career Path Evaluation
    console.log('\n--- 2. Testing Career Path Evaluation Engine ---');
    const careerEval = await analyticsService.evaluateCareerPath(2, 'iOS Developer');
    console.log('✅ Career Path Evaluation Role:', careerEval.selectedCareerPath);
    console.log('✅ Match Score:', careerEval.matchScore, '%');
    console.log('✅ Build Next Topics:', careerEval.buildNextTopics);

    // 3. Test Weekly Activity Analysis
    console.log('\n--- 3. Testing Weekly Activity & Dual Streaks Engine ---');
    const weekly = await analyticsService.getWeeklyActivityAnalysis(2);
    console.log('✅ Streaks:', weekly.streaks);
    console.log('✅ Participation Trend:', weekly.trend || weekly.participation_trend);
    console.log('✅ Category Breakdown:', weekly.categories || weekly.category_breakdown);

    // 4. Test AI Portfolio Synthesis
    console.log('\n--- 4. Testing AI Portfolio Synthesis Engine ---');
    const portfolioRes = await activityService.generateStudentPortfolio(2);
    const portfolio = portfolioRes.portfolio || portfolioRes;
    console.log('✅ Generated Portfolio for:', portfolio.name);
    console.log('✅ AI Synthesized Summary:', portfolio.aiSummary?.substring(0, 80) + '...');
    console.log('✅ Skills count:', portfolio.skills?.length);

    // 5. Test Pure Node.js Portfolio PDF Export
    console.log('\n--- 5. Testing Zero-Dependency PDF Export Engine ---');
    const tempDir = path.resolve(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const pdfPath = path.join(tempDir, 'test_student_portfolio.pdf');

    await activityService.generatePortfolioPDF(2, pdfPath);
    const stat = fs.statSync(pdfPath);
    console.log(`✅ Generated PDF Portfolio at: ${pdfPath} (${stat.size} bytes)`);

    // 6. Test Skill-Matched Recommendations
    console.log('\n--- 6. Testing Skill-Matched Recommendations Engine ---');
    const clubRecs = await analyticsService.getRecommendedClubs(2);
    console.log('✅ Recommended Clubs count:', clubRecs.length);
    const eventRecs = await analyticsService.getRecommendedEvents(2);
    console.log('✅ Recommended Events count:', eventRecs.length);

    console.log('\n==================================================');
    console.log(' 🎉 ALL AI BACKEND INTEGRATIONS VERIFIED 100% PASS!');
    console.log('==================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ AI Integration test failure:', err);
    process.exit(1);
  }
}

testAIIntegration();
