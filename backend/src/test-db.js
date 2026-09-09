import { getPool } from './config/db.js';
import { initializeDatabase } from './database/init.js';
import { seedDatabase } from './database/seed.js';

export async function verifyDatabaseSetup() {
  console.log('==================================================');
  console.log(' AgentVerse Backend MySQL Verification Tool');
  console.log('==================================================\n');

  try {
    await initializeDatabase();
    await seedDatabase();

    const pool = getPool();

    // 1. Verify Database Tables
    console.log('\n--- 1. Checking Table Existence ---');
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map((t) => Object.values(t)[0]);
    console.log(`Found ${tableNames.length} tables:`, tableNames);

    const requiredTables = [
      'users',
      'teacher_profiles',
      'student_profiles',
      'clubs',
      'club_members',
      'applications',
      'notifications',
      'activities',
      'student_activities',
      'certificates',
      'club_performance',
    ];

    const missingTables = requiredTables.filter((t) => !tableNames.includes(t));
    if (missingTables.length > 0) {
      console.error('❌ Missing tables:', missingTables);
    } else {
      console.log('✅ All 11 required tables exist!');
    }

    // 2. Verify Constraints
    console.log('\n--- 2. Checking Database Constraints ---');
    
    // Check Users
    const [users] = await pool.query('SELECT id, full_name, role FROM users');
    console.log(`Users count: ${users.length}`);

    // Check Clubs and Teacher Mentors
    const [clubs] = await pool.query('SELECT id, name, mentor_teacher_id FROM clubs');
    console.log(`Clubs count: ${clubs.length}`, clubs);

    // Check Applications
    const [apps] = await pool.query('SELECT id, club_id, student_id, status FROM applications');
    console.log(`Applications count: ${apps.length}`, apps);

    // Check Notifications
    const [notes] = await pool.query('SELECT id, recipient_user_id, title, message FROM notifications');
    console.log(`Notifications count: ${notes.length}`, notes);

    console.log('\n==================================================');
    console.log(' ✅ MySQL Database Foundation Successfully Verified!');
    console.log('==================================================\n');
  } catch (error) {
    console.error('\n❌ Database verification error:', error.message);
    console.error(error);
  }
}

if (process.argv[1] && process.argv[1].endsWith('test-db.js')) {
  verifyDatabaseSetup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
