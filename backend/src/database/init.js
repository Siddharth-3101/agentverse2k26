import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureDatabaseExists, getPool, handleConnectionError } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  try {
    console.log('\n[DB Init] Step 1: Ensuring database existence on MySQL server...');
    await ensureDatabaseExists();

    console.log('[DB Init] Step 2: Connecting to database pool...');
    const pool = getPool();

    console.log('[DB Init] Step 3: Loading schema definitions...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[DB Init] Step 4: Executing table migrations (CREATE TABLE IF NOT EXISTS)...');
    await pool.query(schemaSql);

    // Verify created tables
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map((t) => Object.values(t)[0]);
    
    console.log(`[DB Init] Migration completed successfully! Total tables present: ${tableNames.length}`);
    console.log('[DB Init] Tables:', tableNames.join(', '));
    return tableNames;
  } catch (error) {
    console.error('\n[DB Init Failed]', error.message);
    if (!error.code) {
      handleConnectionError(error);
    }
    throw error;
  }
}

// Run directly if executed via CLI (node src/database/init.js)
if (process.argv[1] && process.argv[1].endsWith('init.js')) {
  initializeDatabase()
    .then(() => {
      console.log('✅ Database initialization task completed successfully!\n');
      process.exit(0);
    })
    .catch(() => {
      console.error('❌ Database initialization task aborted due to errors.\n');
      process.exit(1);
    });
}
