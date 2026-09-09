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
    reason,
    skills,
  } = data;

  const actualReason = reason_to_join || reason || '';


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
      actualReason || null,
      skills || null,
    ]
  );

  const applicationId = appResult.insertId;

  // 6. Create notifications for Mentor, President, and Vice President of the club
  const recipientIds = new Set();

  // Mentor Teacher
  if (club.mentor_teacher_id) {
    recipientIds.add(club.mentor_teacher_id);
  } else {
    const [profiles] = await pool.query('SELECT user_id FROM teacher_profiles WHERE club_id = ?', [club_id]);
    if (profiles.length > 0) {
      recipientIds.add(profiles[0].user_id);
    }
  }

  // Club President
  if (club.president_user_id) {
    recipientIds.add(club.president_user_id);
  }

  // Club Vice President
  if (club.vp_user_id) {
    recipientIds.add(club.vp_user_id);
  }

  // Also find any executive members in club_members table
  const [execMembers] = await pool.query(
    `SELECT student_id FROM club_members WHERE club_id = ? AND role IN ('PRESIDENT', 'VICE_PRESIDENT') AND status = 'ACTIVE'`,
    [club_id]
  );
  for (const exec of execMembers) {
    recipientIds.add(exec.student_id);
  }

  // Insert notification for each recipient (mentor, pres, vp)
  for (const recipientId of recipientIds) {
    if (recipientId !== studentUserId) {
      await pool.query(
        `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
         VALUES (?, 'CLUB_APPLICATION', 'New Club Application', ?, ?, FALSE)`,
        [recipientId, `${full_name || student.full_name} applied to ${club.name}`, applicationId]
      );
    }
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
    `SELECT a.*, c.name as club_name, c.category as club_category, c.mentor_teacher_id, c.president_user_id, c.vp_user_id
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

export async function getClubApplications(clubId) {
  const pool = getPool();
  const [apps] = await pool.query(
    `SELECT a.*, c.name as club_name, c.category as club_category 
     FROM applications a 
     JOIN clubs c ON a.club_id = c.id 
     WHERE a.club_id = ? 
     ORDER BY a.applied_at DESC`,
    [clubId]
  );
  return apps;
}

export async function getTeacherApplications(teacherUserId) {
  const pool = getPool();

  // Find teacher's assigned club or club where user is mentor/president/vp
  const [clubs] = await pool.query(
    `SELECT id, name FROM clubs WHERE mentor_teacher_id = ? OR president_user_id = ? OR vp_user_id = ?
     UNION 
     SELECT c.id, c.name FROM teacher_profiles tp JOIN clubs c ON tp.club_id = c.id WHERE tp.user_id = ?
     UNION
     SELECT c.id, c.name FROM club_members cm JOIN clubs c ON cm.club_id = c.id WHERE cm.student_id = ? AND cm.role IN ('PRESIDENT', 'VICE_PRESIDENT')`,
    [teacherUserId, teacherUserId, teacherUserId, teacherUserId, teacherUserId]
  );

  if (clubs.length === 0) {
    return [];
  }

  const clubIds = clubs.map((c) => c.id);

  const [apps] = await pool.query(
    `SELECT a.*, c.name as club_name 
     FROM applications a 
     JOIN clubs c ON a.club_id = c.id 
     WHERE a.club_id IN (?) 
     ORDER BY a.applied_at DESC`,
    [clubIds]
  );

  return apps;
}

export async function reviewApplication(reviewerUserId, applicationId, newStatus) {
  if (!['ACCEPTED', 'REJECTED'].includes(newStatus)) {
    throw { status: 400, message: "Invalid status. Must be 'ACCEPTED' or 'REJECTED'." };
  }

  const pool = getPool();
  const application = await getApplicationById(applicationId);

  if (application.status !== 'PENDING') {
    throw { status: 400, message: `Application is already ${application.status}.` };
  }

  // 1. Verify reviewer is mentor teacher, president, VP, or admin
  const [authClubs] = await pool.query(
    `SELECT id FROM clubs WHERE id = ? AND (
      mentor_teacher_id = ? OR 
      president_user_id = ? OR 
      vp_user_id = ? OR 
      id IN (SELECT club_id FROM teacher_profiles WHERE user_id = ?) OR
      id IN (SELECT club_id FROM club_members WHERE student_id = ? AND role IN ('PRESIDENT', 'VICE_PRESIDENT'))
    )`,
    [application.club_id, reviewerUserId, reviewerUserId, reviewerUserId, reviewerUserId, reviewerUserId]
  );

  // If user is ADMIN, allow
  const [admins] = await pool.query('SELECT id, role FROM users WHERE id = ? AND role = "ADMIN"', [reviewerUserId]);

  if (authClubs.length === 0 && admins.length === 0) {
    throw { status: 403, message: 'Forbidden. You can only review applications for clubs you mentor or lead as President/VP.' };
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (newStatus === 'ACCEPTED') {
      // Update status
      await connection.query(
        `UPDATE applications SET status = 'ACCEPTED', reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [reviewerUserId, applicationId]
      );

      // Add student to club_members
      await connection.query(
        `INSERT INTO club_members (club_id, student_id, role, status) VALUES (?, ?, 'MEMBER', 'ACTIVE')
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
          `Congratulations! Your application to join ${application.club_name} has been accepted.`,
          applicationId,
        ]
      );
    } else if (newStatus === 'REJECTED') {
      // Update status
      await connection.query(
        `UPDATE applications SET status = 'REJECTED', reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
        [reviewerUserId, applicationId]
      );

      // Create student notification
      await connection.query(
        `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read)
         VALUES (?, 'APPLICATION_REJECTED', 'Application Rejected', ?, ?, FALSE)`,
        [
          application.student_id,
          `Your application to join ${application.club_name} was not accepted at this time.`,
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
