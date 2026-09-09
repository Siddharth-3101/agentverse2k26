/**
 * startService(name, port, app)
 * Shared bootstrap helper used by every server file.
 * Runs database schema verification then starts the Express listener.
 */

import { initializeDatabase } from '../database/init.js';

export async function startService(name, port, app) {
  console.log(`\n[${name}] Starting service...`);
  try {
    await initializeDatabase();
    console.log(`[${name}] Database schema verified.`);
  } catch (err) {
    console.error(`[${name}] ❌ Database initialisation failed: ${err.message}`);
    console.error(`         Check backend/.env credentials.`);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`[${name}] 🚀 Running on http://localhost:${port}`);
    console.log(`[${name}]    Health: http://localhost:${port}/health`);
  });
}
