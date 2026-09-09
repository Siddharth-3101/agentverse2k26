/**
 * Quick end-to-end integration test against the running 6 microservices.
 * Run with: node src/scripts/testHealth.js
 */

import http from 'http';

const BASE = 'http://localhost';

function request(port, method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost', port,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  let pass = 0; let fail = 0;

  function ok(name, result) {
    console.log(`  ✅  ${name}`);
    if (result !== undefined) console.log(`       ${JSON.stringify(result)}`);
    pass++;
  }
  function ko(name, reason) {
    console.log(`  ❌  ${name}`);
    console.log(`       ${reason}`);
    fail++;
  }

  console.log('\n====================================================');
  console.log(' AgentVerse — 6-Service Health & Integration Test');
  console.log('====================================================\n');

  // ── 1. Health checks ────────────────────────────────────────────────────
  console.log('── Health Checks ──────────────────────────────────────');
  for (const [port, name] of [[5001,'auth-user'],[5002,'club'],[5003,'application'],[5004,'notification'],[5005,'activity'],[5006,'analytics']]) {
    try {
      const r = await request(port, 'GET', '/health');
      r.status === 200 && r.body.status === 'ok'
        ? ok(`:${port} ${name}`, r.body)
        : ko(`:${port} ${name}`, JSON.stringify(r));
    } catch (e) { ko(`:${port} ${name}`, e.message); }
  }

  // ── 2. Auth — login ───────────────────────────────────────────────────
  console.log('\n── Auth Service (5001) ─────────────────────────────────');
  let teacherToken, studentToken;

  try {
    const r = await request(5001, 'POST', '/api/auth/login', { email: 'john.teacher@agentverse.edu' });
    if (r.body?.success && r.body?.data?.token) {
      teacherToken = r.body.data.token;
      ok('Teacher login', { role: r.body.data.user.role });
    } else { ko('Teacher login', JSON.stringify(r.body)); }
  } catch (e) { ko('Teacher login', e.message); }

  try {
    const r = await request(5001, 'POST', '/api/auth/login', { email: 'abc.student@agentverse.edu' });
    if (r.body?.success && r.body?.data?.token) {
      studentToken = r.body.data.token;
      ok('Student login', { role: r.body.data.user.role });
    } else { ko('Student login', JSON.stringify(r.body)); }
  } catch (e) { ko('Student login', e.message); }

  // ── 3. Club service ────────────────────────────────────────────────────
  console.log('\n── Club Service (5002) ─────────────────────────────────');
  let clubId;
  try {
    const r = await request(5002, 'GET', '/api/clubs');
    if (r.body?.success && r.body?.data?.length > 0) {
      clubId = r.body.data[0].id;
      ok('GET /api/clubs', { count: r.body.data.length, firstClub: r.body.data[0].name });
    } else { ko('GET /api/clubs', JSON.stringify(r.body)); }
  } catch (e) { ko('GET /api/clubs', e.message); }

  // ── 4. Application service ─────────────────────────────────────────────
  console.log('\n── Application Service (5003) ──────────────────────────');
  const authHeaders = (tok) => ({ Authorization: `Bearer ${tok}` });

  function requestWithAuth(port, method, path, body, token) {
    return new Promise((resolve, reject) => {
      const data = body ? JSON.stringify(body) : null;
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      };
      const req = http.request({ hostname: 'localhost', port, path, method, headers }, (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); }});
      });
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  }

  // Student submit application
  if (studentToken && clubId) {
    try {
      const r = await requestWithAuth(5003, 'POST', '/api/applications', {
        club_id: clubId,
        full_name: 'ABC Student',
        student_id_number: 'STU001',
        email: 'abc.student@agentverse.edu',
        reason_to_join: 'Love coding',
        skills: 'JS, React',
      }, studentToken);
      const isExpected = r.body?.success || (r.status === 409 && r.body?.message?.includes('pending'));
      isExpected ? ok('Student submit application (or duplicate prevented)', { status: r.status }) : ko('Student submit application', JSON.stringify(r.body));
    } catch (e) { ko('Student submit application', e.message); }

    // Student view own apps
    try {
      const r = await requestWithAuth(5003, 'GET', '/api/applications/my', null, studentToken);
      r.body?.success ? ok('Student GET /api/applications/my', { count: r.body.data.length }) : ko('Student GET /api/applications/my', JSON.stringify(r.body));
    } catch (e) { ko('Student GET /api/applications/my', e.message); }
  }

  // Teacher view applications
  if (teacherToken) {
    try {
      const r = await requestWithAuth(5003, 'GET', '/api/teachers/applications', null, teacherToken);
      r.body?.success ? ok('Teacher GET /api/teachers/applications', { count: r.body.data.length }) : ko('Teacher GET /api/teachers/applications', JSON.stringify(r.body));
    } catch (e) { ko('Teacher GET /api/teachers/applications', e.message); }

    // Student cannot access teacher applications
    if (studentToken) {
      try {
        const r = await requestWithAuth(5003, 'GET', '/api/teachers/applications', null, studentToken);
        r.status === 403 ? ok('Student blocked from teacher apps (403 correct)') : ko('Student should be blocked from teacher apps', `Got ${r.status}`);
      } catch (e) { ko('Auth blocking test', e.message); }
    }
  }

  // ── 5. Notification service ────────────────────────────────────────────
  console.log('\n── Notification Service (5004) ──────────────────────────');
  if (teacherToken) {
    try {
      const r = await requestWithAuth(5004, 'GET', '/api/notifications', null, teacherToken);
      r.body?.success ? ok('Teacher GET /api/notifications', { count: r.body.data.length }) : ko('Teacher GET /api/notifications', JSON.stringify(r.body));
    } catch (e) { ko('Teacher GET /api/notifications', e.message); }

    try {
      const r = await requestWithAuth(5004, 'GET', '/api/notifications/unread-count', null, teacherToken);
      r.body?.success ? ok('GET /api/notifications/unread-count', r.body.data) : ko('unread-count', JSON.stringify(r.body));
    } catch (e) { ko('unread-count', e.message); }
  }

  // ── 6. Activity service ────────────────────────────────────────────────
  console.log('\n── Activity Service (5005) ──────────────────────────────');
  try {
    const r = await request(5005, 'GET', '/api/activities');
    r.body?.success ? ok('GET /api/activities', { count: r.body.data.length }) : ko('GET /api/activities', JSON.stringify(r.body));
  } catch (e) { ko('GET /api/activities', e.message); }

  // ── 7. Analytics service ───────────────────────────────────────────────
  console.log('\n── Analytics Service (5006) ─────────────────────────────');
  if (teacherToken) {
    try {
      const r = await requestWithAuth(5006, 'GET', '/api/analytics/teacher/dashboard', null, teacherToken);
      r.body?.success ? ok('Teacher dashboard analytics', r.body.data) : ko('Teacher dashboard analytics', JSON.stringify(r.body));
    } catch (e) { ko('Teacher dashboard analytics', e.message); }
  }

  try {
    const r = await request(5006, 'GET', '/api/analytics/leaderboard');
    r.body?.success ? ok('Leaderboard', { clubs: r.body.data.length }) : ko('Leaderboard', JSON.stringify(r.body));
  } catch (e) { ko('Leaderboard', e.message); }

  // ── Summary ───────────────────────────────────────────────────────────
  console.log('\n====================================================');
  console.log(` PASSED: ${pass}   FAILED: ${fail}`);
  console.log('====================================================\n');

  if (fail > 0) process.exit(1);
}

run().catch((e) => { console.error(e); process.exit(1); });
