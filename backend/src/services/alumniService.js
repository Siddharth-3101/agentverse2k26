import { getPool } from '../config/db.js';

export async function getAlumniByClubId(clubId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT a.*, c.name as club_name, c.category as club_category
     FROM alumni a
     JOIN clubs c ON a.club_id = c.id
     WHERE a.club_id = ?
     ORDER BY a.graduation_year DESC, a.full_name ASC`,
    [clubId]
  );
  return rows.map(formatAlumniRow);
}

export async function getAllAlumni(filters = {}) {
  const pool = getPool();
  let query = `
    SELECT a.*, c.name as club_name, c.category as club_category
    FROM alumni a
    JOIN clubs c ON a.club_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.clubId) {
    query += ' AND a.club_id = ?';
    params.push(filters.clubId);
  }
  if (filters.company) {
    query += ' AND a.current_company LIKE ?';
    params.push(`%${filters.company}%`);
  }
  if (filters.search) {
    query += ' AND (a.full_name LIKE ? OR a.current_company LIKE ? OR a.current_designation LIKE ? OR a.former_club_role LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  query += ' ORDER BY a.graduation_year DESC, a.full_name ASC';
  const [rows] = await pool.query(query, params);
  return rows.map(formatAlumniRow);
}

export async function getAlumniById(alumniId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT a.*, c.name as club_name, c.category as club_category
     FROM alumni a
     JOIN clubs c ON a.club_id = c.id
     WHERE a.id = ?`,
    [alumniId]
  );
  if (rows.length === 0) {
    throw { status: 404, message: 'Alumnus not found.' };
  }
  return formatAlumniRow(rows[0]);
}

export async function sendAlumniContactMessage(studentUserId, alumniId, data) {
  const pool = getPool();
  const { student_name, student_email, student_phone, request_type = '1:1 Career Guidance', subject, message } = data;

  const alumnus = await getAlumniById(alumniId);

  if (!subject || !message) {
    throw { status: 400, message: 'Subject and message are required to contact alumni.' };
  }

  const [result] = await pool.query(
    `INSERT INTO alumni_messages 
     (alumni_id, student_id, student_name, student_email, student_phone, request_type, subject, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SENT')`,
    [
      alumniId,
      studentUserId,
      student_name || 'Student',
      student_email || 'student@agentverse.edu',
      student_phone || null,
      request_type,
      subject,
      message,
    ]
  );

  // Also create a student notification record confirming receipt
  await pool.query(
    `INSERT INTO notifications (recipient_user_id, type, title, message, is_read)
     VALUES (?, 'ALUMNI_CONNECT', 'Mentorship Request Sent', ?, FALSE)`,
    [
      studentUserId,
      `Your mentorship request regarding '${subject}' was successfully dispatched to ${alumnus.full_name} (${alumnus.current_designation} @ ${alumnus.current_company}).`
    ]
  );

  return {
    id: result.insertId,
    alumni_id: alumniId,
    alumni_name: alumnus.full_name,
    status: 'SENT',
    message: `Message sent to ${alumnus.full_name}. You will be notified when they reply.`
  };
}

function formatAlumniRow(row) {
  if (!row) return null;
  return {
    ...row,
    skills: typeof row.skills === 'string' ? JSON.parse(row.skills || '[]') : (row.skills || []),
    mentorship_areas: typeof row.mentorship_areas === 'string' ? JSON.parse(row.mentorship_areas || '[]') : (row.mentorship_areas || []),
  };
}
