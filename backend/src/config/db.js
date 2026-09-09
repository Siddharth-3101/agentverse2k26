import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;

/**
  Formats friendly diagnostic messages for MySQL connection failures.
 */
export function handleConnectionError(err) {
  console.error('\n==================================================');
  console.error(' ❌ MYSQL CONNECTION FAILURE DIAGNOSTICS');
  console.error('==================================================');

  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    console.error(`1. MySQL server is not running or unreachable at ${config.db.host}:${config.db.port}.`);
    console.error('   👉 FIX: Start your MySQL service (e.g. via XAMPP, Services.msc, or MySQL Workbench).');
  } else if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.errno === 1045) {
    console.error(`2. Invalid MySQL credentials for user '${config.db.user}'.`);
    console.error(`   👉 FIX: Update DB_USER and DB_PASSWORD inside backend/.env with your valid MySQL credentials.`);
  } else if (err.code === 'ER_DBACCESS_DENIED_ERROR' || err.errno === 1044) {
    console.error(`3. User '${config.db.user}' lacks permission to create or access database '${config.db.database}'.`);
    console.error('   👉 FIX: Grant required privileges to user or run as root/admin user.');
  } else {
    console.error(`4. Connection Error [${err.code || 'UNKNOWN'}]: ${err.message}`);
    console.error('   👉 FIX: Verify DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD settings in backend/.env.');
  }

  console.error('==================================================\n');
}

/**
 * Step 1: Connect to MySQL server WITHOUT specifying a database,
 * then execute CREATE DATABASE IF NOT EXISTS agentverse;
 */
export async function ensureDatabaseExists() {
  try {
    const rootConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
    });

    console.log(`[MySQL Connection] Connecting to MySQL server at ${config.db.host}:${config.db.port}...`);
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`[MySQL Database] Verified database '${config.db.database}' exists.`);
    await rootConnection.end();
  } catch (err) {
    handleConnectionError(err);
    throw err;
  }
}

/**
 * Step 2: Establish connection pool connected to the agentverse database.
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
  }
  return pool;
}
