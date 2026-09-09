import { getPool } from '../config/db.js';

export async function submitApplication(studentUserId, data) {
  const pool = getPool();
  const {
    club_id,
    full_name,
    student_id_number,
    email,
    phone_number,
    department,
    year_of_study,
    reason_to_join,
    skills,
  } = data;

  // 1. Verify student exists
  const [students] = await pool.query('SELECT * FROM users WHERE id = ?', [studentUserId]);
  if (students.length === 0) {
    throw { status: 404, message: 'Student user not found.' };
  }
  const student = students[0];

  // 2. Verify club exists
  const [clubs] = await pool.query('SELECT * FROM clubs WHERE id = ?', [club_id]);
  if (clubs.length === 0) {
    throw { status: 404, message: 'Club not found.' };
  }
  const club = clubs[0];

  // 3. Verify student is not already an active member of the club
  const [existingMembers] = await pool.query(
    'SELECT id FROM club_members WHERE club_id = ? AND student_id = ? AND status = "ACTIVE"',
    [club_id, studentUserId]
  );
  if (existingMembers.length > 0) {
    throw { status: 400, message: `You are already an active member of '${club.name}'.` };
  }

  // 4. Prevent duplicate pending applications
  const [pendingApps] = await pool.query(
    'SELECT id FROM applications WHERE club_id = ? AND student_id = ? AND status = "PENDING"',
    [club_id, studentUserId]
  );
  if (pendingApps.length > 0) {
    throw {
      status: 409,
      message: `You already have a pending application for '${club.name}'. Please wait for teacher review.`,
    };
  }

  // 5. Store application
  const [appResult] = await pool.query(
    `INSERT INTO applications 
     (club_id, student_id, full_name, student_id_number, email, phone_number, department, year_of_study, reason_to_join, skills, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
    [
      club_id,
      studentUserId,
      full_name || student.full_name,
      student_id_number || 'STU_GEN',
      email || student.email,
      phone_number || student.phone_number || null,
      department || student.department || null,
      year_of_study || student.year_of_study || null,
      reason_to_join || null,
      skills || null,
    ]
  );

  const applicationId = appResult.insertId;

  // 6. Create notification for the teacher assigned to that club
  let teacherUserId = club.mentor_teacher_id;
  if (!teacherUserId) {
    const [profiles] = await pool.query('SELECT user_id FROM teacher_profiles WHERE club_id = ?', [club_id]);
    if (profiles.length > 0) {
      teacherUserId = profiles[0].user_id;
    }
  }

  if (teacherUserId) {
    await pool.query(
      `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
       VALUES (?, 'CLUB_APPLICATION', 'New Club Application', ?, ?, FALSE)`,
      [teacherUserId, `${full_name || student.full_name} applied to ${club.name}`, applicationId]
    );
  }

  return getApplicationById(applicationId);
}

export async function getStudentApplications(studentUserId) {
  const pool = getPool();
  const [apps] = await pool.query(
    `SELECT a.*, c.name as club_name, c.category as club_category 
     FROM applications a 
     JOIN clubs c ON a.club_id = c.id 
     WHERE a.student_id = ? 
     ORDER BY a.applied_at DESC`,
    [studentUserId]
  );
  return apps;
}

export async function getApplicationById(applicationId) {
  const pool = getPool();
  const [apps] = await pool.query(
    `SELECT a.*, c.name as club_name, c.category as club_category, c.mentor_teacher_id
     FROM applications a 
     JOIN clubs c ON a.club_id = c.id 
     WHERE a.id = ?`,
    [applicationId]
  );

  if (apps.length === 0) {
    throw { status: 404, message: 'Application not found.' };
  }

  return apps[0];
}

export async function getTeacherApplications(teacherUserId) {
  const pool = getPool();

  // Find teacher's assigned club
  const [clubs] = await pool.query(
    `SELECT id, name FROM clubs WHERE mentor_teacher_id = ?
     UNION 
     SELECT c.id, c.name FROM teacher_profiles tp JOIN clubs c ON tp.club_id = c.id WHERE tp.user_id = ?`,
    [teacherUserId, teacherUserId]
  );

  if (clubs.length === 0) {
    return [];
  }

  const clubId = clubs[0].id;

  const [apps] = await pool.query(
    `SELECT a.*, c.name as club_name 
     FROM applications a 
     JOIN clubs c ON a.club_id = c.id 
     WHERE a.club_id = ? 
     ORDER BY a.applied_at DESC`,
    [clubId]
  );

  return apps;
}

export async function reviewApplication(teacherUserId, applicationId, newStatus) {
  if (!['ACCEPTED', 'REJECTED'].includes(newStatus)) {
    throw { status: 400, message: "Invalid status. Must be 'ACCEPTED' or 'REJECTED'." };
  }

  const pool = getPool();
  const application = await getApplicationById(applicationId);

  if (application.status !== 'PENDING') {
    throw { status: 400, message: `Application is already ${application.status}.` };
  }

  // 1. Verify teacher owns/mentors the club
  const [teacherClubs] = await pool.query(
    `SELECT id FROM clubs WHERE id = ? AND (mentor_teacher_id = ? OR id IN (SELECT club_id FROM teacher_profiles WHERE user_id = ?))`,
    [application.club_id, teacherUserId, teacherUserId]
  );

  if (teacherClubs.length === 0) {
    throw { status: 403, message: 'Forbidden. You can only review applications for your assigned club.' };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (newStatus === 'ACCEPTED') {
      // Update status
      await connection.query(
        `UPDATE applications SET status = 'ACCEPTED', reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [teacherUserId, applicationId]
      );

      // Add student to club_members
      await connection.query(
        `INSERT INTO club_members (club_id, student_id, status) VALUES (?, ?, 'ACTIVE')
         ON DUPLICATE KEY UPDATE status = 'ACTIVE'`,
        [application.club_id, application.student_id]
      );

      // Update club member count
      await connection.query(
        `UPDATE clubs SET member_count = (SELECT COUNT(*) FROM club_members WHERE club_id = ? AND status = 'ACTIVE') WHERE id = ?`,
        [application.club_id, application.club_id]
      );

      // Create student notification
      await connection.query(
        `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
         VALUES (?, 'APPLICATION_ACCEPTED', 'Application Accepted', ?, ?, FALSE)`,
        [
          application.student_id,
          `Your application to ${application.club_name} has been accepted.`,
          applicationId,
        ]
      );
    } else if (newStatus === 'REJECTED') {
      // Update status
      await connection.query(
        `UPDATE applications SET status = 'REJECTED', reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [teacherUserId, applicationId]
      );

      // Create student notification
      await connection.query(
        `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
         VALUES (?, 'APPLICATION_REJECTED', 'Application Rejected', ?, ?, FALSE)`,
        [
          application.student_id,
          `Your application to ${application.club_name} has been rejected.`,
          applicationId,
        ]
      );
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return getApplicationById(applicationId);
}
