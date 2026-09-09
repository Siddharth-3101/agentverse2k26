/**
 * AgentVerse Backend — FULL API AUDIT TEST
 * Read-only unless absolutely required by the test workflow.
 * Run with: node src/scripts/audit.js
 */

import http from 'http';

// ─── HTTP helper ─────────────────────────────────────────────────────────────
function req(port, method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const r = http.request({ hostname: 'localhost', port, path, method, headers }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(raw); } catch { parsed = raw; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    r.on('error', (e) => resolve({ status: 0, body: { error: e.message } }));
    if (data) r.write(data);
    r.end();
  });
}

// ─── Reporting helpers ───────────────────────────────────────────────────────
const results = [];
let pass = 0, fail = 0, warn = 0;

function record(service, method, endpoint, auth, role, status, result, problem = '') {
  results.push({ service, method, endpoint, auth, role, status, result, problem });
  if (result === 'PASS') pass++;
  else if (result === 'FAIL') { fail++; console.log(`  ❌ FAIL  [${service}] ${method} ${endpoint} — ${problem}`); }
  else if (result === 'WARN') { warn++; console.log(`  ⚠️  WARN  [${service}] ${method} ${endpoint} — ${problem}`); }
}

function header(title) { console.log(`\n${'═'.repeat(62)}\n  ${title}\n${'═'.repeat(62)}`); }

// ─── Tokens ───────────────────────────────────────────────────────────────────
let teacherToken = null;
let studentToken = null;
let teacherUserId = null;
let studentUserId = null;
let clubId = null;
let applicationId = null;
let activityId = null;
let notificationId = null;
let teacherId_param = null;
let studentId_param = null;

// ─── BUGS tracking ───────────────────────────────────────────────────────────
const bugs = [];
function bug(service, endpoint, problem, expected, actual, severity, file, fn, fix) {
  bugs.push({ service, endpoint, problem, expected, actual, severity, file, fn, fix });
}

// ═══════════════════════════════════════════════════════════════════════════════
async function run() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║     AgentVerse Backend — Complete API Audit & Test           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 1: Health Checks');
  // ───────────────────────────────────────────────────────────────────────────

  const healthMap = {
    5001: 'auth-user', 5002: 'club', 5003: 'application',
    5004: 'notification', 5005: 'activity', 5006: 'analytics',
  };
  for (const [port, svc] of Object.entries(healthMap)) {
    const r = await req(+port, 'GET', '/health');
    const ok = r.status === 200 && r.body?.status === 'ok' && r.body?.service === svc;
    record(svc, 'GET', `/health`, 'No', 'Public', r.status,
      ok ? 'PASS' : 'FAIL',
      ok ? '' : `Expected {status:ok, service:${svc}}, got ${JSON.stringify(r.body)}`);
  }

  // DB health check endpoints
  for (const port of [5001, 5002]) {
    const r = await req(port, 'GET', '/health/db');
    const ok = r.status === 200 && r.body?.db === 'ok';
    record(healthMap[port], 'GET', '/health/db', 'No', 'Public', r.status,
      ok ? 'PASS' : 'FAIL', ok ? '' : JSON.stringify(r.body));
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 2: Auth Service — Port 5001');
  // ───────────────────────────────────────────────────────────────────────────

  // 2a. Login — teacher
  {
    const r = await req(5001, 'POST', '/api/auth/login', { email: 'john.teacher@agentverse.edu' });
    if (r.status === 200 && r.body?.success && r.body?.data?.token) {
      teacherToken = r.body.data.token;
      teacherUserId = r.body.data.user.id;
      teacherId_param = String(teacherUserId);
      record('Auth', 'POST', '/api/auth/login', 'No', 'Public', 200, 'PASS');
      console.log(`  ✅ Teacher login OK — userId=${teacherUserId}`);
    } else {
      record('Auth', 'POST', '/api/auth/login', 'No', 'Public', r.status, 'FAIL',
        `Teacher login failed: ${JSON.stringify(r.body)}`);
      bug('Auth', 'POST /api/auth/login', 'Teacher cannot login',
        'Token returned', JSON.stringify(r.body), 'CRITICAL',
        'authUserService.js', 'loginUser', 'Check password_hash field and bcrypt compare logic');
    }
  }

  // 2b. Login — student
  {
    const r = await req(5001, 'POST', '/api/auth/login', { email: 'abc.student@agentverse.edu' });
    if (r.status === 200 && r.body?.success && r.body?.data?.token) {
      studentToken = r.body.data.token;
      studentUserId = r.body.data.user.id;
      studentId_param = String(studentUserId);
      record('Auth', 'POST', '/api/auth/login (student)', 'No', 'Public', 200, 'PASS');
      console.log(`  ✅ Student login OK — userId=${studentUserId}`);
    } else {
      record('Auth', 'POST', '/api/auth/login (student)', 'No', 'Public', r.status, 'FAIL',
        `Student login failed: ${JSON.stringify(r.body)}`);
      bug('Auth', 'POST /api/auth/login', 'Student cannot login',
        'Token returned', JSON.stringify(r.body), 'CRITICAL',
        'authUserService.js', 'loginUser', 'Check password logic for seed users without bcrypt hash');
    }
  }

  // 2c. Login — wrong password
  {
    const r = await req(5001, 'POST', '/api/auth/login', { email: 'john.teacher@agentverse.edu', password: 'wrongpass123' });
    const ok = r.status === 401;
    record('Auth', 'POST', '/api/auth/login (wrong pw)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401, got ' + r.status);
  }

  // 2d. Login — nonexistent email
  {
    const r = await req(5001, 'POST', '/api/auth/login', { email: 'noone@nowhere.com', password: 'x' });
    const ok = r.status === 401;
    record('Auth', 'POST', '/api/auth/login (nonexistent)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401');
  }

  // 2e. Login — missing body (no email/password)
  {
    const r = await req(5001, 'POST', '/api/auth/login', {});
    const ok = r.status === 401 || r.status === 400;
    record('Auth', 'POST', '/api/auth/login (empty body)', 'No', 'Public', r.status, ok ? 'PASS' : 'WARN',
      ok ? '' : `Expected 400/401, got ${r.status} — note: loginUser allows null password`);
    if (!ok) bug('Auth', 'POST /api/auth/login', 'Empty body login bypasses validation',
      '400 Bad Request', `${r.status} ${JSON.stringify(r.body)}`, 'MEDIUM',
      'authUserService.js', 'loginUser',
      'Add input validation: require email; return 400 if missing');
  }

  // 2f. GET /api/auth/me — authenticated
  if (teacherToken) {
    const r = await req(5001, 'GET', '/api/auth/me', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Auth', 'GET', '/api/auth/me', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2g. GET /api/auth/me — unauthenticated
  {
    const r = await req(5001, 'GET', '/api/auth/me');
    const ok = r.status === 401;
    record('Auth', 'GET', '/api/auth/me (no token)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401, got ' + r.status);
  }

  // 2h. GET /api/auth/me — invalid JWT
  {
    const r = await req(5001, 'GET', '/api/auth/me', null, 'Bearer invalid.jwt.token');
    const ok = r.status === 401;
    record('Auth', 'GET', '/api/auth/me (invalid JWT)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401 for invalid JWT, got ' + r.status);
  }

  // 2i. GET /api/auth/me — malformed Authorization header
  {
    const r = await req(5001, 'GET', '/api/auth/me', null, 'NotBearer abc');
    const ok = r.status === 401;
    record('Auth', 'GET', '/api/auth/me (malformed header)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401 for malformed header');
  }

  // 2j. POST /api/auth/logout
  {
    const r = await req(5001, 'POST', '/api/auth/logout');
    const ok = r.status === 200;
    record('Auth', 'POST', '/api/auth/logout', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2k. GET /api/users/profile
  if (teacherToken) {
    const r = await req(5001, 'GET', '/api/users/profile', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Auth', 'GET', '/api/users/profile', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2l. PUT /api/users/profile
  if (teacherToken) {
    const r = await req(5001, 'PUT', '/api/users/profile', { phone_number: '9999999999' }, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Auth', 'PUT', '/api/users/profile', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2m. GET /api/students/:studentId
  if (studentToken && studentId_param) {
    const r = await req(5001, 'GET', `/api/students/${studentId_param}`, null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Auth', 'GET', '/api/students/:id', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2n. GET /api/students/:id — nonexistent
  if (teacherToken) {
    const r = await req(5001, 'GET', '/api/students/99999', null, teacherToken);
    const ok = r.status === 404;
    record('Auth', 'GET', '/api/students/99999 (nonexistent)', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // 2o. GET /api/teachers/:teacherId
  if (teacherToken && teacherId_param) {
    const r = await req(5001, 'GET', `/api/teachers/${teacherId_param}`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Auth', 'GET', '/api/teachers/:id', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 2p. Student accessing teacher route — check if cross-user data leaks
  if (studentToken && teacherId_param) {
    const r = await req(5001, 'GET', `/api/teachers/${teacherId_param}`, null, studentToken);
    // No role restriction on this route — student can read teacher profile. Flag as info.
    record('Auth', 'GET', `/api/teachers/:id (as student)`, 'Yes', 'Any', r.status,
      r.status === 200 ? 'WARN' : 'PASS',
      r.status === 200 ? 'Student can view teacher profile (no role restriction on this route)' : '');
    if (r.status === 200) {
      bug('Auth', 'GET /api/teachers/:id', 'No role restriction — any authenticated user can view any teacher profile',
        '403 for students or own-teacher check', '200 returned to STUDENT role',
        'LOW', 'authUserRoutes.js', 'getTeacher route', 'Add requireRole or ownership check if private data is present');
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 3: Club Service — Port 5002');
  // ───────────────────────────────────────────────────────────────────────────

  // 3a. GET /api/clubs — public
  {
    const r = await req(5002, 'GET', '/api/clubs');
    const ok = r.status === 200 && r.body?.success && Array.isArray(r.body?.data);
    record('Club', 'GET', '/api/clubs', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0) {
      clubId = r.body.data[0].id;
      console.log(`  ✅ Clubs fetched — clubId=${clubId}, name="${r.body.data[0].name}"`);
    }
  }

  // 3b. GET /api/clubs/:id
  if (clubId) {
    const r = await req(5002, 'GET', `/api/clubs/${clubId}`);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'GET', '/api/clubs/:id', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 3c. GET /api/clubs/:id — nonexistent
  {
    const r = await req(5002, 'GET', '/api/clubs/99999');
    const ok = r.status === 404;
    record('Club', 'GET', '/api/clubs/99999 (nonexistent)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // 3d. GET /api/clubs/:id/members
  if (clubId) {
    const r = await req(5002, 'GET', `/api/clubs/${clubId}/members`);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'GET', '/api/clubs/:id/members', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 3e. GET /api/clubs/:id/mentor
  if (clubId) {
    const r = await req(5002, 'GET', `/api/clubs/${clubId}/mentor`);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'GET', '/api/clubs/:id/mentor', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 3f. GET /api/students/:id/clubs — authenticated
  if (studentToken && studentId_param) {
    const r = await req(5002, 'GET', `/api/students/${studentId_param}/clubs`, null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'GET', '/api/students/:id/clubs', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 3g. GET /api/students/:id/clubs — unauthenticated
  if (studentId_param) {
    const r = await req(5002, 'GET', `/api/students/${studentId_param}/clubs`);
    const ok = r.status === 401;
    record('Club', 'GET', '/api/students/:id/clubs (no token)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401');
  }

  // 3h. GET /api/teachers/:id/club
  if (teacherToken && teacherId_param) {
    const r = await req(5002, 'GET', `/api/teachers/${teacherId_param}/club`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'GET', '/api/teachers/:id/club', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 3i. POST /api/clubs — as teacher
  if (teacherToken) {
    const r = await req(5002, 'POST', '/api/clubs', {
      name: `AUDIT_TEST_CLUB_${Date.now()}`,
      description: 'Audit test club — created during API audit, can be deleted',
      category: 'TECH',
    }, teacherToken);
    const ok = r.status === 201 && r.body?.success;
    record('Club', 'POST', '/api/clubs', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) console.log(`  ℹ️  Created test club id=${r.body.data.id} for audit purposes`);
  }

  // 3j. POST /api/clubs — as student (should be 403)
  if (studentToken) {
    const r = await req(5002, 'POST', '/api/clubs', { name: 'StudentHackClub', category: 'TECH' }, studentToken);
    const ok = r.status === 403;
    record('Club', 'POST', '/api/clubs (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403, got ' + r.status);
  }

  // 3k. POST /api/clubs — unauthenticated
  {
    const r = await req(5002, 'POST', '/api/clubs', { name: 'Anon Club', category: 'TECH' });
    const ok = r.status === 401;
    record('Club', 'POST', '/api/clubs (unauthenticated)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401');
  }

  // 3l. PUT /api/clubs/:id — missing name validation
  if (teacherToken && clubId) {
    const r = await req(5002, 'PUT', `/api/clubs/${clubId}`, { description: 'Updated by audit' }, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Club', 'PUT', '/api/clubs/:id', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 4: Application Service — Port 5003');
  // ───────────────────────────────────────────────────────────────────────────

  // 4a. GET /api/applications/my — student view own
  if (studentToken) {
    const r = await req(5003, 'GET', '/api/applications/my', null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Application', 'GET', '/api/applications/my', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0) {
      applicationId = r.body.data[0].id;
      console.log(`  ℹ️  Existing application found: id=${applicationId}, status=${r.body.data[0].status}`);
    }
  }

  // 4b. GET /api/applications/my — as teacher (should fail: requires STUDENT)
  if (teacherToken) {
    const r = await req(5003, 'GET', '/api/applications/my', null, teacherToken);
    const ok = r.status === 403;
    record('Application', 'GET', '/api/applications/my (as TEACHER)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403 (STUDENT only), got ' + r.status);
  }

  // 4c. GET /api/teachers/applications — teacher view
  if (teacherToken) {
    const r = await req(5003, 'GET', '/api/teachers/applications', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Application', 'GET', '/api/teachers/applications', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0 && !applicationId) {
      applicationId = r.body.data[0].id;
    }
  }

  // 4d. GET /api/teachers/applications — as student (should 403)
  if (studentToken) {
    const r = await req(5003, 'GET', '/api/teachers/applications', null, studentToken);
    const ok = r.status === 403;
    record('Application', 'GET', '/api/teachers/applications (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403');
  }

  // 4e. GET /api/applications/:id
  if (studentToken && applicationId) {
    const r = await req(5003, 'GET', `/api/applications/${applicationId}`, null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Application', 'GET', '/api/applications/:id', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 4f. GET /api/applications/:id — nonexistent
  if (teacherToken) {
    const r = await req(5003, 'GET', '/api/applications/99999', null, teacherToken);
    const ok = r.status === 404;
    record('Application', 'GET', '/api/applications/99999 (nonexistent)', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // 4g. POST /api/applications — student already active member
  if (studentToken && clubId) {
    const r = await req(5003, 'POST', '/api/applications', {
      club_id: clubId,
      full_name: 'Test Student',
      student_id_number: 'STU001',
      email: 'abc.student@agentverse.edu',
      reason_to_join: 'Audit test application',
    }, studentToken);
    const ok = r.status === 409 || r.status === 400; // already member or already pending
    record('Application', 'POST', '/api/applications (duplicate guard)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? `Correctly blocked: ${r.body?.message}` : `Expected 400/409, got ${r.status}`);
  }

  // 4h. POST /api/applications — as teacher (should 403)
  if (teacherToken && clubId) {
    const r = await req(5003, 'POST', '/api/applications', { club_id: clubId }, teacherToken);
    const ok = r.status === 403;
    record('Application', 'POST', '/api/applications (as TEACHER)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403');
  }

  // 4i. PATCH /api/applications/:id/status — invalid status value
  if (teacherToken && applicationId) {
    const r = await req(5003, 'PATCH', `/api/applications/${applicationId}/status`,
      { status: 'MAYBE' }, teacherToken);
    const ok = r.status === 400;
    record('Application', 'PATCH', '/api/applications/:id/status (invalid status)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 400 for invalid status value, got ' + r.status);
  }

  // 4j. PATCH status — student cannot change status (role guard)
  if (studentToken && applicationId) {
    const r = await req(5003, 'PATCH', `/api/applications/${applicationId}/status`,
      { status: 'ACCEPTED' }, studentToken);
    const ok = r.status === 403;
    record('Application', 'PATCH', '/api/applications/:id/status (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403 for student changing status');
  }

  // 4k. PATCH status on nonexistent application
  if (teacherToken) {
    const r = await req(5003, 'PATCH', '/api/applications/99999/status',
      { status: 'ACCEPTED' }, teacherToken);
    const ok = r.status === 404;
    record('Application', 'PATCH', '/api/applications/99999/status (nonexistent)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // 4l. Check if already-reviewed application gets double-review blocked
  if (teacherToken && applicationId) {
    const appRes = await req(5003, 'GET', `/api/applications/${applicationId}`, null, teacherToken);
    const currentStatus = appRes.body?.data?.status;
    if (currentStatus === 'ACCEPTED' || currentStatus === 'REJECTED') {
      const r = await req(5003, 'PATCH', `/api/applications/${applicationId}/status`,
        { status: 'ACCEPTED' }, teacherToken);
      const ok = r.status === 400;
      record('Application', 'PATCH', '/api/applications/:id/status (already reviewed)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
        ok ? `Correctly blocked re-review: ${r.body?.message}` : 'Expected 400 for re-review of non-PENDING app');
    } else {
      record('Application', 'PATCH', '/api/applications/:id/status (already reviewed)', 'Yes', 'TEACHER', 'N/A', 'WARN',
        'No reviewed application available to test double-review guard — PENDING status only');
    }
  }

  // 4m. GET /api/teachers/applications/:id
  if (teacherToken && applicationId) {
    const r = await req(5003, 'GET', `/api/teachers/applications/${applicationId}`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Application', 'GET', '/api/teachers/applications/:id', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 5: Notification Service — Port 5004');
  // ───────────────────────────────────────────────────────────────────────────

  // 5a. GET /api/notifications — teacher
  if (teacherToken) {
    const r = await req(5004, 'GET', '/api/notifications', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'GET', '/api/notifications (teacher)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0) {
      notificationId = r.body.data[0].id;
    }
  }

  // 5b. GET /api/notifications — student
  if (studentToken) {
    const r = await req(5004, 'GET', '/api/notifications', null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'GET', '/api/notifications (student)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0 && !notificationId) {
      notificationId = r.body.data[0].id;
    }
  }

  // 5c. GET /api/notifications — unauthenticated (should 401)
  {
    const r = await req(5004, 'GET', '/api/notifications');
    const ok = r.status === 401;
    record('Notification', 'GET', '/api/notifications (no token)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401');
  }

  // 5d. GET /api/notifications/unread-count
  if (teacherToken) {
    const r = await req(5004, 'GET', '/api/notifications/unread-count', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'GET', '/api/notifications/unread-count', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 5e. GET /api/notifications/:id — own notification
  if (teacherToken && notificationId) {
    const r = await req(5004, 'GET', `/api/notifications/${notificationId}`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'GET', '/api/notifications/:id', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 5f. Cross-user: student accessing teacher's notification
  if (studentToken && notificationId) {
    // Get teacher's notification with student token — should return 403 or empty/404
    const r = await req(5004, 'GET', `/api/notifications/${notificationId}`, null, studentToken);
    const ok = r.status === 403 || r.status === 404;
    record('Notification', 'GET', '/api/notifications/:id (cross-user)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? 'Correctly denied cross-user access' : `⚠️ Cross-user notification access returned ${r.status}`);
    if (!ok) bug('Notification', 'GET /api/notifications/:id',
      'Cross-user notification data leakage: student can read teacher notifications',
      '403 or 404', `${r.status} returned to student`,
      'HIGH', 'notificationService.js', 'getNotificationById',
      'Add ownership check: WHERE id=? AND recipient_user_id=req.user.id');
  }

  // 5g. PATCH /api/notifications/:id/read
  if (teacherToken && notificationId) {
    const r = await req(5004, 'PATCH', `/api/notifications/${notificationId}/read`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'PATCH', '/api/notifications/:id/read', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 5h. PATCH /api/notifications/read-all
  if (studentToken) {
    const r = await req(5004, 'PATCH', '/api/notifications/read-all', null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Notification', 'PATCH', '/api/notifications/read-all', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 5i. GET /api/notifications/:id — nonexistent
  if (teacherToken) {
    const r = await req(5004, 'GET', '/api/notifications/99999', null, teacherToken);
    const ok = r.status === 404;
    record('Notification', 'GET', '/api/notifications/99999 (nonexistent)', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 6: Activity Service — Port 5005');
  // ───────────────────────────────────────────────────────────────────────────

  // 6a. GET /api/activities — public
  {
    const r = await req(5005, 'GET', '/api/activities');
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/activities', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && r.body.data.length > 0) {
      activityId = r.body.data[0].id;
    }
  }

  // 6b. GET /api/activities with filter
  {
    const r = await req(5005, 'GET', '/api/activities?activity_type=EVENT');
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/activities?activity_type=EVENT', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6c. GET /api/activities/:id
  if (activityId) {
    const r = await req(5005, 'GET', `/api/activities/${activityId}`);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/activities/:id', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6d. GET /api/activities/:id — nonexistent
  {
    const r = await req(5005, 'GET', '/api/activities/99999');
    const ok = r.status === 404;
    record('Activity', 'GET', '/api/activities/99999 (nonexistent)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // 6e. POST /api/activities — teacher creates activity
  let auditActivityId = null;
  if (teacherToken) {
    const r = await req(5005, 'POST', '/api/activities', {
      title: 'AUDIT_TEST_ACTIVITY',
      description: 'Created during API audit',
      activity_type: 'EVENT',
      organizer: 'Audit Team',
      start_date: '2027-01-01T09:00:00',
    }, teacherToken);
    const ok = r.status === 201 && r.body?.success;
    record('Activity', 'POST', '/api/activities', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) {
      auditActivityId = r.body.data.id;
      if (!activityId) activityId = auditActivityId;
      console.log(`  ℹ️  Created test activity id=${auditActivityId}`);
    }
  }

  // 6f. POST /api/activities — missing required fields
  if (teacherToken) {
    const r = await req(5005, 'POST', '/api/activities', { description: 'no title' }, teacherToken);
    const ok = r.status === 400;
    record('Activity', 'POST', '/api/activities (missing title)', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 400 for missing title');
  }

  // 6g. POST /api/activities — as student (should 403)
  if (studentToken) {
    const r = await req(5005, 'POST', '/api/activities', {
      title: 'StudentActivity', activity_type: 'EVENT'
    }, studentToken);
    const ok = r.status === 403;
    record('Activity', 'POST', '/api/activities (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403');
  }

  // 6h. PUT /api/activities/:id
  if (teacherToken && auditActivityId) {
    const r = await req(5005, 'PUT', `/api/activities/${auditActivityId}`,
      { title: 'AUDIT_TEST_ACTIVITY (updated)', location: 'Online' }, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'PUT', '/api/activities/:id', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6i. DELETE /api/activities/:id — by teacher
  if (teacherToken && auditActivityId) {
    const r = await req(5005, 'DELETE', `/api/activities/${auditActivityId}`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'DELETE', '/api/activities/:id', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) console.log(`  ℹ️  Deleted audit test activity id=${auditActivityId}`);
  }

  // 6j. DELETE /api/activities/:id — as student (403)
  if (studentToken && activityId) {
    const r = await req(5005, 'DELETE', `/api/activities/${activityId}`, null, studentToken);
    const ok = r.status === 403;
    record('Activity', 'DELETE', '/api/activities/:id (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403');
  }

  // 6k. GET /api/students/:id/activities
  if (studentToken && studentId_param) {
    const r = await req(5005, 'GET', `/api/students/${studentId_param}/activities`, null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/students/:id/activities', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6l. POST /api/students/:id/activities — register for activity
  if (studentToken && studentId_param && activityId) {
    const r = await req(5005, 'POST', `/api/students/${studentId_param}/activities`,
      { activity_id: activityId, participation_status: 'REGISTERED' }, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'POST', '/api/students/:id/activities', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6m. GET /api/clubs/:id/activities — public
  if (clubId) {
    const r = await req(5005, 'GET', `/api/clubs/${clubId}/activities`);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/clubs/:id/activities', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6n. GET /api/certificates — authenticated
  if (studentToken) {
    const r = await req(5005, 'GET', '/api/certificates', null, studentToken);
    const ok = r.status === 200 && r.body?.success;
    record('Activity', 'GET', '/api/certificates', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 6o. POST /api/certificates — with valid data
  let auditCertId = null;
  if (studentToken) {
    const r = await req(5005, 'POST', '/api/certificates',
      { title: 'AUDIT_TEST_CERT', organization: 'Audit Inc', category: 'Tech', issue_date: '2026-01-01' }, studentToken);
    const ok = r.status === 201 && r.body?.success;
    record('Activity', 'POST', '/api/certificates', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) {
      auditCertId = r.body.data.id;
      console.log(`  ℹ️  Created test certificate id=${auditCertId}`);
    }
  }

  // 6p. POST /api/certificates — missing title (400)
  if (studentToken) {
    const r = await req(5005, 'POST', '/api/certificates', { organization: 'No Title Corp' }, studentToken);
    const ok = r.status === 400;
    record('Activity', 'POST', '/api/certificates (missing title)', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 400 for missing title');
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 7: Analytics Service — Port 5006');
  // ───────────────────────────────────────────────────────────────────────────

  // 7a. GET /api/analytics/teacher/dashboard — teacher only
  if (teacherToken) {
    const r = await req(5006, 'GET', '/api/analytics/teacher/dashboard', null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/teacher/dashboard', 'Yes', 'TEACHER', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) console.log(`  ✅ Dashboard: members=${r.body.data.members}, pending=${r.body.data.pendingApplications}`);
  }

  // 7b. GET /api/analytics/teacher/dashboard — as student (403)
  if (studentToken) {
    const r = await req(5006, 'GET', '/api/analytics/teacher/dashboard', null, studentToken);
    const ok = r.status === 403;
    record('Analytics', 'GET', '/api/analytics/teacher/dashboard (as STUDENT)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403');
  }

  // 7c. GET /api/analytics/teacher/dashboard — unauthenticated
  {
    const r = await req(5006, 'GET', '/api/analytics/teacher/dashboard');
    const ok = r.status === 401;
    record('Analytics', 'GET', '/api/analytics/teacher/dashboard (no auth)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401');
  }

  // 7d. GET /api/analytics/club/:id
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 7e. GET /api/analytics/club/:id/members
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}/members`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id/members', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 7f. GET /api/analytics/club/:id/applications
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}/applications`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id/applications', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 7g. GET /api/analytics/club/:id/activities
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}/activities`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id/activities', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 7h. GET /api/analytics/club/:id/departments
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}/departments`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id/departments', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok && Array.isArray(r.body.data) && r.body.data.length > 0) {
      const fake = r.body.data.find(d => d.department === 'Computer Science' && d.count === 1 && r.body.data.length <= 2);
      if (fake) {
        bug('Analytics', 'GET /api/analytics/club/:id/departments',
          'Returns hardcoded fallback data when no real members found',
          'Empty array or real data', 'Hardcoded [{department: "Computer Science", count: 1}]',
          'MEDIUM', 'analyticsService.js', 'getClubDepartmentDistribution',
          'Return empty array [] instead of hardcoded fallback — frontend should handle empty state');
        record('Analytics', 'GET', '/api/analytics/club/:id/departments (hardcoded fallback)', 'Yes', 'Any',
          r.status, 'WARN', 'Returns hardcoded department data as fallback when no real data exists');
      }
    }
  }

  // 7i. GET /api/analytics/club/:id/membership-growth
  if (teacherToken && clubId) {
    const r = await req(5006, 'GET', `/api/analytics/club/${clubId}/membership-growth`, null, teacherToken);
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/club/:id/membership-growth', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
    if (ok) {
      const data = r.body.data;
      const hasFake = Array.isArray(data) && data[0]?.period === 'January' && data[0]?.members === 10;
      if (hasFake) {
        bug('Analytics', 'GET /api/analytics/club/:id/membership-growth',
          'Returns hardcoded fake membership growth data when no real data found',
          'Empty array or real DB data', 'Hardcoded [{period:"January",members:10}, ...]',
          'MEDIUM', 'analyticsService.js', 'getClubMembershipGrowth',
          'Return [] instead of fake hardcoded growth data');
        record('Analytics', 'GET', '/api/analytics/club/:id/membership-growth (hardcoded fallback)', 'Yes', 'Any',
          r.status, 'WARN', 'Returns hardcoded fake growth data as fallback');
      }
    }
  }

  // 7j. GET /api/analytics/leaderboard — public
  {
    const r = await req(5006, 'GET', '/api/analytics/leaderboard');
    const ok = r.status === 200 && r.body?.success;
    record('Analytics', 'GET', '/api/analytics/leaderboard', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : JSON.stringify(r.body));
  }

  // 7k. Analytics — nonexistent club
  if (teacherToken) {
    const r = await req(5006, 'GET', '/api/analytics/club/99999', null, teacherToken);
    const ok = r.status === 404;
    record('Analytics', 'GET', '/api/analytics/club/99999 (nonexistent)', 'Yes', 'Any', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 404, got ' + r.status);
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 8: Microservice Isolation Checks');
  // ───────────────────────────────────────────────────────────────────────────

  // Check that each service only exposes its own routes
  const isolationTests = [
    // Club routes should NOT work on auth port
    [5001, 'GET', '/api/clubs', 'Auth port must not expose club routes'],
    // Auth routes should NOT work on club port
    [5002, 'POST', '/api/auth/login', 'Club port must not expose auth routes'],
    // Application routes should NOT work on notification port
    [5004, 'GET', '/api/applications/my', 'Notification port must not expose application routes'],
    // Activity routes should NOT work on analytics port
    [5006, 'GET', '/api/activities', 'Analytics port must not expose activity routes'],
  ];

  for (const [port, method, path, label] of isolationTests) {
    const r = await req(port, method, path, null, teacherToken);
    const ok = r.status === 404; // should get 404 - route not found
    record('Isolation', method, `${path} on :${port}`, 'Yes', 'Any', r.status, ok ? 'PASS' : 'WARN',
      ok ? '' : `${label} — got ${r.status} ${JSON.stringify(r.body).substring(0, 100)}`);
    if (!ok) {
      bug('Isolation', `${method} ${path} on :${port}`,
        label, '404 Not Found (route not registered)', `${r.status} returned`,
        'LOW', 'server entry points / createApp.js',
        'Route mounting', 'Confirm only the correct router is mounted per server');
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  header('SECTION 9: Security Edge Cases');
  // ───────────────────────────────────────────────────────────────────────────

  // Expired JWT (fabricated)
  const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6IlRFQUNIRVIiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.FAKE_SIGNATURE';
  {
    const r = await req(5001, 'GET', '/api/auth/me', null, expiredJWT);
    const ok = r.status === 401;
    record('Security', 'GET', '/api/auth/me (expired JWT)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 401 for expired token');
  }

  // Wrong role: student cannot use teacher analytics dashboard
  if (studentToken) {
    const r = await req(5006, 'GET', '/api/analytics/teacher/dashboard', null, studentToken);
    const ok = r.status === 403;
    record('Security', 'GET', '/api/analytics/teacher/dashboard (wrong role)', 'Yes', 'STUDENT', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : 'Expected 403 for wrong role');
  }

  // Malformed JSON body
  {
    const badBody = '{"malformed: json}';
    const r = await new Promise((resolve) => {
      const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(badBody) };
      if (teacherToken) headers['Authorization'] = `Bearer ${teacherToken}`;
      const r2 = http.request({ hostname: 'localhost', port: 5001, path: '/api/auth/login', method: 'POST', headers }, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => resolve({ status: res.statusCode, body: raw }));
      });
      r2.on('error', (e) => resolve({ status: 0, body: e.message }));
      r2.write(badBody);
      r2.end();
    });
    const ok = r.status === 400;
    record('Security', 'POST', '/api/auth/login (malformed JSON)', 'No', 'Public', r.status, ok ? 'PASS' : 'FAIL',
      ok ? '' : `Expected 400 for malformed JSON, got ${r.status}`);
    if (!ok) bug('Auth', 'POST /api/auth/login',
      'Malformed JSON body not handled with 400', '400 Bad Request',
      `${r.status}`, 'LOW', 'Express JSON middleware',
      'express.json()', 'Express should auto-return 400 for bad JSON — may need custom error handler');
  }

  // ─── FINAL REPORT ──────────────────────────────────────────────────────────
  console.log('\n\n' + '═'.repeat(62));
  console.log('  COMPLETE AUDIT REPORT');
  console.log('═'.repeat(62));

  // Endpoint table
  console.log('\n### 2. ENDPOINT TEST TABLE\n');
  console.log('Service'.padEnd(15) + 'Method'.padEnd(8) + 'Endpoint'.padEnd(48) + 'Auth'.padEnd(6) + 'Role'.padEnd(12) + 'Status'.padEnd(8) + 'Result'.padEnd(8) + 'Problem');
  console.log('-'.repeat(130));
  results.forEach(r => {
    const row = [
      r.service.padEnd(15),
      r.method.padEnd(8),
      r.endpoint.substring(0, 46).padEnd(48),
      r.auth.padEnd(6),
      r.role.padEnd(12),
      String(r.status).padEnd(8),
      r.result.padEnd(8),
      r.problem.substring(0, 80),
    ].join('');
    const pfx = r.result === 'PASS' ? '✅' : r.result === 'FAIL' ? '❌' : '⚠️ ';
    console.log(pfx + ' ' + row);
  });

  // Summary
  console.log('\n### SUMMARY\n');
  const serviceNames = ['Auth', 'Club', 'Application', 'Notification', 'Activity', 'Analytics'];
  const svcResults = {};
  serviceNames.forEach(s => {
    const mine = results.filter(r => r.service.toLowerCase().includes(s.toLowerCase()) || (s === 'Auth' && r.service === 'Security'));
    const p = mine.filter(r => r.result === 'PASS').length;
    const f = mine.filter(r => r.result === 'FAIL').length;
    const w = mine.filter(r => r.result === 'WARN').length;
    svcResults[s] = { p, f, w, total: mine.length };
  });
  serviceNames.forEach(s => {
    const { p, f, w, total } = svcResults[s];
    const pct = total > 0 ? Math.round((p / total) * 100) : 0;
    const status = f === 0 ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${s.padEnd(14)}: ${status}  (${p}P/${f}F/${w}W of ${total} checks — ${pct}%)`);
  });

  console.log(`\n  TOTALS: ${pass} PASS | ${fail} FAIL | ${warn} WARN\n`);

  // Bugs
  console.log('\n### 6. BUGS FOUND\n');
  if (bugs.length === 0) {
    console.log('  No bugs found.\n');
  } else {
    bugs.forEach((b, i) => {
      console.log(`  BUG #${i + 1} [${b.severity}] — ${b.service} — ${b.endpoint}`);
      console.log(`    Problem  : ${b.problem}`);
      console.log(`    Expected : ${b.expected}`);
      console.log(`    Actual   : ${b.actual}`);
      console.log(`    File     : ${b.file} → ${b.fn}`);
      console.log(`    Fix      : ${b.fix}\n`);
    });
  }

  // Overall score
  console.log('\n### 8. OVERALL SCORES\n');
  serviceNames.forEach(s => {
    const { p, total } = svcResults[s];
    const pct = total > 0 ? Math.round((p / total) * 100) : 0;
    console.log(`  ${s.padEnd(14)}: ${pct}%`);
  });
  const overall = results.length > 0 ? Math.round((pass / results.length) * 100) : 0;
  console.log(`\n  Overall backend API readiness: ${overall}%\n`);

  process.exit(fail > 0 ? 1 : 0);
}

run().catch(e => { console.error('Audit script error:', e); process.exit(1); });
