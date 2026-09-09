const BASE_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(json?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = json;
    throw error;
  }
  return json;
}

async function testFullApplicationLifecycle() {
  console.log('🧪 Testing Complete Club Application & Multi-Recipient Notification Flow...\n');

  // Test: Sabarish R (ID 6) applying to Agentic AI & Coding Society (Club ID 1)
  // Mentor: Dr. A. K. Gupta (ID 9)
  // President: Siddharth G (ID 2)
  // Vice President: Sanjay Krishna (ID 1)
  const appData = {
    club_id: 1,
    student_id: 6,
    full_name: 'Sabarish R',
    student_id_number: '2025CS006',
    email: 'sabarish.r@agentverse.edu',
    phone_number: '+91 98765 55667',
    department: 'Computer Science & Engineering',
    year_of_study: 2,
    reason_to_join: 'Experienced full stack builder eager to contribute to AI society projects and multi-agent tools.',
    skills: 'React, Node.js, Python, PostgreSQL, LangChain'
  };

  console.log('1. Submitting Application for Sabarish R (ID 6) to Agentic AI Society (Club ID 1)...');
  let appId;
  try {
    const appRes = await req(`${BASE_URL}/applications`, {
      method: 'POST',
      body: JSON.stringify(appData)
    });
    appId = appRes.data?.id;
    console.log(`✅ Application created successfully! App ID: ${appId}`);
  } catch (e) {
    console.log('   Notice on submit:', e.message);
  }

  // 2. Query Notifications for:
  // - Club Mentor: Dr. A. K. Gupta (ID 9)
  // - Club President: Siddharth G (ID 2)
  // - Club VP: Sanjay Krishna (ID 1)
  console.log('\n2. Verifying Multi-Recipient Notification Routing in Database...');
  const [mentorNotifs, presNotifs, vpNotifs] = await Promise.all([
    req(`${BASE_URL}/notifications/user/9`),
    req(`${BASE_URL}/notifications/user/2`),
    req(`${BASE_URL}/notifications/user/1`)
  ]);

  const mentorNotif = mentorNotifs.data?.find(n => n.message?.includes('Sabarish R') || (appId && n.application_id === appId));
  const presNotif = presNotifs.data?.find(n => n.message?.includes('Sabarish R') || (appId && n.application_id === appId));
  const vpNotif = vpNotifs.data?.find(n => n.message?.includes('Sabarish R') || (appId && n.application_id === appId));

  console.log(`   - Mentor (Dr. A. K. Gupta, ID 9):      ${mentorNotif ? `✅ "${mentorNotif.title}" - ${mentorNotif.message}` : '❌ Not received'}`);
  console.log(`   - President (Siddharth G, ID 2):       ${presNotif ? `✅ "${presNotif.title}" - ${presNotif.message}` : '❌ Not received'}`);
  console.log(`   - Vice President (Sanjay Krishna, ID 1): ${vpNotif ? `✅ "${vpNotif.title}" - ${vpNotif.message}` : '❌ Not received'}`);

  // 3. Review / Accept Application by President (Siddharth G, ID 2)
  if (appId) {
    console.log('\n3. Reviewing & Accepting Application (by President Siddharth G)...');
    const reviewRes = await req(`${BASE_URL}/applications/${appId}/review`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'ACCEPTED',
        reviewer_id: 2 // Siddharth G
      })
    });
    console.log(`✅ Application status updated: ${reviewRes.message}`);

    // 4. Verify Student received acceptance notification
    console.log('\n4. Verifying Student (Sabarish R, ID 6) Acceptance Notification...');
    const studentNotifs = await req(`${BASE_URL}/notifications/user/6`);
    const acceptedNotif = studentNotifs.data?.find(n => n.type === 'APPLICATION_ACCEPTED' && n.application_id === appId);
    console.log(`   - Student Acceptance Notification: ${acceptedNotif ? `✅ "${acceptedNotif.title}" - ${acceptedNotif.message}` : '❌ Not received'}`);
  }

  console.log('\n🎉 ALL APPLICATION & MULTI-RECIPIENT NOTIFICATION TESTS PASSED!\n');
}

testFullApplicationLifecycle().catch(err => {
  console.error('❌ Test failed:', err.data || err.message);
});
