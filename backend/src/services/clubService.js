import { getPool } from '../config/db.js';

export async function getAllClubs() {
  const pool = getPool();
  const [clubs] = await pool.query(
    `SELECT c.*, u.full_name as mentor_name, u.email as mentor_email 
     FROM clubs c 
     LEFT JOIN users u ON c.mentor_teacher_id = u.id 
     ORDER BY c.name ASC`
  );
  return clubs;
}

export async function getClubById(clubId) {
  const pool = getPool();
  const [clubs] = await pool.query(
    `SELECT c.*, u.full_name as mentor_name, u.email as mentor_email, tp.staff_id as mentor_staff_id 
     FROM clubs c 
     LEFT JOIN users u ON c.mentor_teacher_id = u.id 
     LEFT JOIN teacher_profiles tp ON u.id = tp.user_id 
     WHERE c.id = ?`,
    [clubId]
  );

  if (clubs.length === 0) {
    throw { status: 404, message: 'Club not found.' };
  }

  return clubs[0];
}

export async function getClubMembers(clubId) {
  const pool = getPool();
  const [members] = await pool.query(
    `SELECT cm.id as membership_id, cm.joined_at, cm.status, 
            u.id as student_user_id, u.full_name, u.email, u.phone_number, u.department, u.year_of_study,
            sp.student_id as student_id_number
     FROM club_members cm 
     JOIN users u ON cm.student_id = u.id 
     LEFT JOIN student_profiles sp ON u.id = sp.user_id 
     WHERE cm.club_id = ? AND cm.status = 'ACTIVE'
     ORDER BY cm.joined_at DESC`,
    [clubId]
  );
  return members;
}

export async function getClubMentor(clubId) {
  const pool = getPool();
  const [mentors] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.phone_number, u.department, tp.staff_id
     FROM clubs c 
     JOIN users u ON c.mentor_teacher_id = u.id 
     LEFT JOIN teacher_profiles tp ON u.id = tp.user_id 
     WHERE c.id = ?`,
    [clubId]
  );

  if (mentors.length === 0) {
    return null;
  }
  return mentors[0];
}

export async function getStudentClubs(studentId) {
  const pool = getPool();
  const [clubs] = await pool.query(
    `SELECT c.*, cm.joined_at, cm.status as membership_status 
     FROM club_members cm 
     JOIN clubs c ON cm.club_id = c.id 
     WHERE cm.student_id = ? AND cm.status = 'ACTIVE'`,
    [studentId]
  );
  return clubs;
}

export async function getTeacherClub(teacherId) {
  const pool = getPool();
  const [clubs] = await pool.query(
    `SELECT c.* 
     FROM clubs c 
     WHERE c.mentor_teacher_id = ?`,
    [teacherId]
  );

  if (clubs.length === 0) {
    // Try finding via teacher_profiles
    const [profiles] = await pool.query(
      `SELECT c.* FROM teacher_profiles tp JOIN clubs c ON tp.club_id = c.id WHERE tp.user_id = ?`,
      [teacherId]
    );
    return profiles[0] || null;
  }
  return clubs[0];
}

export async function createClub(data) {
  const pool = getPool();
  const { name, description, category, mentor_teacher_id, logo_url, banner_url, tags, social_links, contact_email } = data;

  // Enforce ONE TEACHER = ONE CLUB rule!
  if (mentor_teacher_id) {
    const [existingTeacherClub] = await pool.query(
      'SELECT id, name FROM clubs WHERE mentor_teacher_id = ?',
      [mentor_teacher_id]
    );
    if (existingTeacherClub.length > 0) {
      throw {
        status: 400,
        message: `Teacher is already assigned as mentor to club '${existingTeacherClub[0].name}'. A teacher can mentor only one club.`,
      };
    }
  }

  const tagsJson = tags ? JSON.stringify(tags) : null;
  const socialLinksJson = social_links ? JSON.stringify(social_links) : null;

  const [result] = await pool.query(
    `INSERT INTO clubs (name, description, category, mentor_teacher_id, member_count, logo_url, banner_url, tags, social_links, contact_email)
     VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
    [name, description || null, category || null, mentor_teacher_id || null, logo_url || null, banner_url || null, tagsJson, socialLinksJson, contact_email || null]
  );

  const newClubId = result.insertId;

  // Link to teacher profile
  if (mentor_teacher_id) {
    await pool.query('UPDATE teacher_profiles SET club_id = ? WHERE user_id = ?', [
      newClubId,
      mentor_teacher_id,
    ]);
  }

  return getClubById(newClubId);
}

export async function updateClub(clubId, data) {
  const pool = getPool();
  const { name, description, category, mentor_teacher_id, logo_url, banner_url, tags, social_links, contact_email } = data;

  // Enforce ONE TEACHER = ONE CLUB rule if updating mentor!
  if (mentor_teacher_id) {
    const [existingTeacherClub] = await pool.query(
      'SELECT id, name FROM clubs WHERE mentor_teacher_id = ? AND id != ?',
      [mentor_teacher_id, clubId]
    );
    if (existingTeacherClub.length > 0) {
      throw {
        status: 400,
        message: `Teacher is already assigned as mentor to club '${existingTeacherClub[0].name}'. A teacher can mentor only one club.`,
      };
    }
  }

  const tagsJson = tags !== undefined ? JSON.stringify(tags) : undefined;
  const socialLinksJson = social_links !== undefined ? JSON.stringify(social_links) : undefined;

  await pool.query(
    `UPDATE clubs 
     SET name = COALESCE(?, name), 
         description = COALESCE(?, description), 
         category = COALESCE(?, category), 
         mentor_teacher_id = COALESCE(?, mentor_teacher_id),
         logo_url = COALESCE(?, logo_url),
         banner_url = COALESCE(?, banner_url),
         tags = COALESCE(?, tags),
         social_links = COALESCE(?, social_links),
         contact_email = COALESCE(?, contact_email)
     WHERE id = ?`,
    [name, description, category, mentor_teacher_id, logo_url, banner_url, tagsJson, socialLinksJson, contact_email, clubId]
  );

  if (mentor_teacher_id) {
    await pool.query('UPDATE teacher_profiles SET club_id = ? WHERE user_id = ?', [
      clubId,
      mentor_teacher_id,
    ]);
  }

  return getClubById(clubId);
}
