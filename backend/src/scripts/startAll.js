/**
 * startAll.js
 * Convenience script: spawns all six microservices as independent child processes.
 * Each service keeps its own stdout/stderr with a coloured prefix.
 *
 * Usage:  npm run services
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const root       = path.resolve(__dirname, '..');

const services = [
  { name: 'auth',         file: 'servers/authServer.js',         color: '\x1b[36m' }, // cyan
  { name: 'club',         file: 'servers/clubServer.js',         color: '\x1b[32m' }, // green
  { name: 'application',  file: 'servers/applicationServer.js',  color: '\x1b[33m' }, // yellow
  { name: 'notification', file: 'servers/notificationServer.js', color: '\x1b[35m' }, // magenta
  { name: 'activity',     file: 'servers/activityServer.js',     color: '\x1b[34m' }, // blue
  { name: 'analytics',    file: 'servers/analyticsServer.js',    color: '\x1b[31m' }, // red
];

const reset = '\x1b[0m';

services.forEach(({ name, file, color }) => {
  const child = spawn('node', [path.join(root, file)], {
    stdio: 'pipe',
    env: { ...process.env },
  });

  const prefix = `${color}[${name}]${reset} `;

  child.stdout.on('data', (d) => process.stdout.write(`${prefix}${d}`));
  child.stderr.on('data', (d) => process.stderr.write(`${prefix}${d}`));

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${prefix}❌ Process exited with code ${code}`);
    }
  });
});

console.log('\n🚀 AgentVerse — All 6 microservices starting...\n');
console.log('  Auth/User Service  →  http://localhost:5001/health');
console.log('  Club Service       →  http://localhost:5002/health');
console.log('  Application        →  http://localhost:5003/health');
console.log('  Notification       →  http://localhost:5004/health');
console.log('  Activity           →  http://localhost:5005/health');
console.log('  Analytics          →  http://localhost:5006/health');
console.log('\nPress Ctrl+C to stop all services.\n');
