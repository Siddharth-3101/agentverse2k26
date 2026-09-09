import { getPool } from '../config/db.js';

export async function getAllActivities(query = {}) {
  const pool = getPool();
  const { activity_type, limit } = query;

  let sql = 'SELECT * FROM activities WHERE 1=1';
  const params = [];

  if (activity_type) {
    sql += ' AND activity_type = ?';
    params.push(activity_type);
  }

  sql += ' ORDER BY start_date DESC, created_at DESC';

  if (limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(limit, 10));
  }

  const [activities] = await pool.query(sql, params);
  return activities;
}

export async function getActivityById(activityId) {
  const pool = getPool();
  const [activities] = await pool.query('SELECT * FROM activities WHERE id = ?', [activityId]);

  if (activities.length === 0) {
    throw { status: 404, message: 'Activity not found.' };
  }

  return activities[0];
}

export async function createActivity(data) {
  const pool = getPool();
  const {
    title,
    description,
    activity_type,
    organizer,
    start_date,
    end_date,
    location,
    mode,
    fee,
    team_size,
    deadline,
    logo_url,
    banner_url,
    google_form_url,
    is_featured,
    tags,
    eligibility,
  } = data;

  if (!title || !activity_type) {
    throw { status: 400, message: 'Title and activity_type are required fields.' };
  }

  const tagsJson = tags ? JSON.stringify(tags) : null;
  const eligibilityJson = eligibility ? JSON.stringify(eligibility) : null;

  const [result] = await pool.query(
    `INSERT INTO activities (title, description, activity_type, organizer, start_date, end_date, location, mode, fee, team_size, deadline, logo_url, banner_url, google_form_url, is_featured, tags, eligibility)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || null,
      activity_type,
      organizer || null,
      start_date || null,
      end_date || null,
      location || null,
      mode || 'Offline',
      fee || 'Free',
      team_size || null,
      deadline || null,
      logo_url || null,
      banner_url || null,
      google_form_url || null,
      is_featured ? 1 : 0,
      tagsJson,
      eligibilityJson,
    ]
  );

  return getActivityById(result.insertId);
}

export async function updateActivity(activityId, data) {
  const pool = getPool();
  const {
    title,
    description,
    activity_type,
    organizer,
    start_date,
    end_date,
    location,
    mode,
    fee,
    team_size,
    deadline,
    logo_url,
    banner_url,
    google_form_url,
    is_featured,
    tags,
    eligibility,
  } = data;

  await getActivityById(activityId);

  const tagsJson = tags !== undefined ? JSON.stringify(tags) : undefined;
  const eligibilityJson = eligibility !== undefined ? JSON.stringify(eligibility) : undefined;

  await pool.query(
    `UPDATE activities 
     SET title = COALESCE(?, title),
         description = COALESCE(?, description),
         activity_type = COALESCE(?, activity_type),
         organizer = COALESCE(?, organizer),
         start_date = COALESCE(?, start_date),
         end_date = COALESCE(?, end_date),
         location = COALESCE(?, location),
         mode = COALESCE(?, mode),
         fee = COALESCE(?, fee),
         team_size = COALESCE(?, team_size),
         deadline = COALESCE(?, deadline),
         logo_url = COALESCE(?, logo_url),
         banner_url = COALESCE(?, banner_url),
         google_form_url = COALESCE(?, google_form_url),
         is_featured = COALESCE(?, is_featured),
         tags = COALESCE(?, tags),
         eligibility = COALESCE(?, eligibility)
     WHERE id = ?`,
    [
      title,
      description,
      activity_type,
      organizer,
      start_date,
      end_date,
      location,
      mode,
      fee,
      team_size,
      deadline,
      logo_url,
      banner_url,
      google_form_url,
      is_featured !== undefined ? (is_featured ? 1 : 0) : undefined,
      tagsJson,
      eligibilityJson,
      activityId,
    ]
  );

  return getActivityById(activityId);
}

export async function deleteActivity(activityId) {
  const pool = getPool();
  await getActivityById(activityId);
  await pool.query('DELETE FROM activities WHERE id = ?', [activityId]);
  return { success: true, message: 'Activity deleted successfully.' };
}

export async function getStudentActivities(studentUserId) {
  const pool = getPool();
  const [studentActs] = await pool.query(
    `SELECT sa.id as registration_id, sa.participation_status, sa.achievement, sa.certificate_url as student_cert_url, sa.created_at as registered_at,
            a.* 
     FROM student_activities sa 
     JOIN activities a ON sa.activity_id = a.id 
     WHERE sa.student_id = ? 
     ORDER BY a.start_date DESC`,
    [studentUserId]
  );
  return studentActs;
}

export async function registerStudentForActivity(studentUserId, activityId, data = {}) {
  const pool = getPool();
  const { participation_status, achievement, certificate_url } = data;

  await getActivityById(activityId);

  await pool.query(
    `INSERT INTO student_activities (student_id, activity_id, participation_status, achievement, certificate_url)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE 
       participation_status = COALESCE(VALUES(participation_status), participation_status),
       achievement = COALESCE(VALUES(achievement), achievement),
       certificate_url = COALESCE(VALUES(certificate_url), certificate_url)`,
    [
      studentUserId,
      activityId,
      participation_status || 'REGISTERED',
      achievement || null,
      certificate_url || null,
    ]
  );

  return getStudentActivities(studentUserId);
}

export async function getClubActivities(clubId) {
  const pool = getPool();
  const [club] = await pool.query('SELECT name FROM clubs WHERE id = ?', [clubId]);
  const organizerName = club[0]?.name || '';

  const [activities] = await pool.query(
    `SELECT * FROM activities WHERE organizer = ? OR organizer LIKE ? ORDER BY start_date DESC`,
    [organizerName, `%${organizerName}%`]
  );
  return activities;
}

export async function getStudentCertificates(studentUserId) {
  const pool = getPool();
  const [certs] = await pool.query(
    `SELECT * FROM certificates WHERE student_id = ? ORDER BY created_at DESC`,
    [studentUserId]
  );
  return certs;
}

export async function addCertificate(studentUserId, data) {
  const pool = getPool();
  const { title, organization, category, issue_date, certificate_url, extracted_data } = data;

  if (!title) {
    throw { status: 400, message: 'Certificate title is required.' };
  }

  const [result] = await pool.query(
    `INSERT INTO certificates (student_id, title, organization, category, issue_date, certificate_url, extracted_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      studentUserId,
      title,
      organization || null,
      category || null,
      issue_date || null,
      certificate_url || null,
      extracted_data ? JSON.stringify(extracted_data) : null,
    ]
  );

  const [certs] = await pool.query('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
  return certs[0];
}
