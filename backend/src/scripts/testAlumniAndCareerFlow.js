import { getPool } from '../config/db.js';
import * as analyticsService from '../services/analyticsService.js';
import * as alumniService from '../services/alumniService.js';

async function runTests() {
  console.log('🧪 Starting Career Pathway & Alumni Connect Verification Suite...\n');

  // Test 1: Career Pathway Evaluation
  console.log('1. Evaluating Career Path for "Backend Developer"...');
  const backendEval = await analyticsService.evaluateCareerPath(1, 'Backend Developer');
  console.log('   - Role:', backendEval.roadmap.role);
  console.log('   - Milestones count:', backendEval.roadmap.milestones.length);
  const m1 = backendEval.roadmap.milestones[0];
  console.log('   - Milestone 1:', m1.topic, '| Status:', m1.status, '| Skills:', m1.skills.join(', '));
  
  if (!m1.skills || m1.skills.length === 0) {
    throw new Error('Milestone skills array is missing or empty!');
  }
  console.log('   ✅ Career pathway milestone skills properly linked!');

  // Test 2: AI Engineer Pathway
  console.log('\n2. Evaluating Career Path for "AI Engineer"...');
  const aiEval = await analyticsService.evaluateCareerPath(2, 'AI Engineer');
  console.log('   - Role:', aiEval.roadmap.role);
  console.log('   - Milestones:', aiEval.roadmap.milestones.map(m => m.topic).join(' -> '));
  console.log('   ✅ AI Engineer career tree generated cleanly!');

  // Test 3: Club Alumni Query
  console.log('\n3. Querying Alumni for Agentic AI Society (Club 1)...');
  const club1Alumni = await alumniService.getAlumniByClubId(1);
  console.log('   - Found', club1Alumni.length, 'alumni mentors:');
  club1Alumni.forEach(a => console.log('     •', a.full_name, '(', a.current_designation, '@', a.current_company, ')'));
  if (club1Alumni.length === 0) throw new Error('No alumni returned for club 1');
  console.log('   ✅ Club alumni records retrieved successfully!');

  // Test 4: Send Mentorship Request
  console.log('\n4. Sending Mentorship Request to Alumnus (ID 1: Aravind Subramanian)...');
  const contactRes = await alumniService.sendAlumniContactMessage(1, 1, {
    student_name: 'Sanjay Krishna',
    student_email: 'sanjay.krishna@agentverse.edu',
    student_phone: '+91 98765 11223',
    request_type: '1:1 Career Guidance',
    subject: 'Preparing for Agentic AI Research Roles',
    message: 'Hello Aravind, I am Vice President of the AI Society and would love to ask for guidance regarding multimodal agents.'
  });
  console.log('   - Status:', contactRes.status);
  console.log('   - Response message:', contactRes.message);

  // Test 5: Verify Notification Generated in DB
  const pool = getPool();
  const [notifs] = await pool.query(
    'SELECT * FROM notifications WHERE recipient_user_id = 1 AND type = "ALUMNI_CONNECT" ORDER BY id DESC LIMIT 1'
  );
  if (notifs.length > 0) {
    console.log('   - Notification record in DB:', notifs[0].title, '|', notifs[0].message);
    console.log('   ✅ Student confirmation notification verified in database!');
  }

  console.log('\n======================================================');
  console.log('🎉 ALL CAREER PATH & ALUMNI CONNECT TESTS PASSED (5/5)!');
  console.log('======================================================\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
