import { getPool } from '../config/db.js';
import { initializeDatabase } from './init.js';

export async function seedDatabase() {
  await initializeDatabase();
  const pool = getPool();
  console.log('[DB Seed] Seeding development mock data safely...');

  // 1. Seed Users (Teacher & Student)
  const teacherEmail = 'john.teacher@agentverse.edu';
  const studentEmail = 'abc.student@agentverse.edu';

  await pool.execute(
    `INSERT IGNORE INTO users (id, full_name, email, password_hash, role, department, year_of_study) 
     VALUES 
     (1, 'John Teacher', ?, '$2b$10$e1...mockhash', 'TEACHER', 'Computer Science', NULL),
     (2, 'ABC Student', ?, '$2b$10$e2...mockhash', 'STUDENT', 'Computer Science', 2)`,
    [teacherEmail, studentEmail]
  );

  // Fetch actual user IDs
  const [users] = await pool.execute(`SELECT id, email, role FROM users WHERE email IN (?, ?)`, [
    teacherEmail,
    studentEmail,
  ]);
  const teacherUser = users.find((u) => u.role === 'TEACHER');
  const studentUser = users.find((u) => u.role === 'STUDENT');

  if (!teacherUser || !studentUser) {
    console.log('[DB Seed] Error resolving seeded users.');
    return;
  }

  // 2. Seed Club
  await pool.execute(
    `INSERT INTO clubs (id, name, description, category, mentor_teacher_id, member_count) 
     VALUES (1, 'Coding Club', 'Official Computer Science & Software Development Club', 'Technical', ?, 1)
     ON DUPLICATE KEY UPDATE mentor_teacher_id = VALUES(mentor_teacher_id)`,
    [teacherUser.id]
  );

  const [clubs] = await pool.execute(`SELECT id FROM clubs WHERE name = 'Coding Club'`);
  const clubId = clubs[0]?.id || 1;

  // 3. Seed Teacher Profile
  await pool.execute(
    `INSERT INTO teacher_profiles (user_id, staff_id, department, club_id) 
     VALUES (?, 'STF001', 'Computer Science', ?)
     ON DUPLICATE KEY UPDATE club_id = VALUES(club_id)`,
    [teacherUser.id, clubId]
  );

  // 4. Seed Student Profile
  await pool.execute(
    `INSERT IGNORE INTO student_profiles (user_id, student_id, department, year_of_study) 
     VALUES (?, 'STU001', 'Computer Science', 2)`,
    [studentUser.id]
  );

  // 5. Seed Application
  const [existingApps] = await pool.execute(
    `SELECT id FROM applications WHERE club_id = ? AND student_id = ?`,
    [clubId, studentUser.id]
  );

  let appId = existingApps[0]?.id;
  if (!appId) {
    const [appResult] = await pool.execute(
      `INSERT INTO applications 
       (club_id, student_id, full_name, student_id_number, email, phone_number, department, year_of_study, reason_to_join, skills, status) 
       VALUES (?, ?, 'ABC Student', 'STU001', ?, '9876543210', 'Computer Science', 2, 'Passionate about coding & algorithm design.', 'JavaScript, Python, React', 'PENDING')`,
      [clubId, studentUser.id, studentEmail]
    );
    appId = appResult.insertId;
  }

  // 6. Seed Notification
  const [existingNotes] = await pool.execute(
    `SELECT id FROM notifications WHERE recipient_user_id = ? AND application_id = ?`,
    [teacherUser.id, appId]
  );

  if (existingNotes.length === 0) {
    await pool.execute(
      `INSERT INTO notifications (recipient_user_id, type, title, message, application_id, is_read) 
       VALUES (?, 'APPLICATION_SUBMITTED', 'New Club Application', 'ABC Student applied to Coding Club', ?, FALSE)`,
      [teacherUser.id, appId]
    );
  }

  // 7. Seed Initial Club Performance
  await pool.execute(
    `INSERT IGNORE INTO club_performance (club_id, members_count, activities_count, participation_count, score, ranking) 
     VALUES (?, 1, 3, 15, 850, 1)`,
    [clubId]
  );

  console.log('[DB Seed] Development seed data populated successfully!');
}

// Run directly if called as a script
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('[DB Seed] Seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[DB Seed Error]', err);
      process.exit(1);
    });
}
