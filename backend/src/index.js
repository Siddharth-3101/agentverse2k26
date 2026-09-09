import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env.js';
import { initializeDatabase } from './database/init.js';
import { seedDatabase } from './database/seed.js';
import { getPool } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authUserRoutes from './routes/authUserRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health Check Endpoint
app.get(['/health', '/api/health', '/api/v1/health'], async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'UP',
      database: config.db.database,
      dbConnection: rows[0]?.result === 2 ? 'OK' : 'ERROR',
      aiEngine: 'Certificate Intelligence & Roadmap.sh Ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(200).json({
      status: 'DEGRADED',
      database: config.db.database,
      dbConnection: 'OFFLINE_MOCK_FALLBACK',
      aiEngine: 'Active (Local Mode)',
      error: error.message,
    });
  }
});

// Manual Database Re-initialization & Seed endpoint
app.post(['/api/db/init', '/api/v1/db/init'], async (req, res, next) => {
  try {
    const tables = await initializeDatabase();
    if (req.body?.seed) {
      await seedDatabase();
    }
    res.json({ success: true, message: 'Database schema initialized.', tables });
  } catch (error) {
    next(error);
  }
});

// Mount Backend Service Routers under /api and /api/v1
const mountAll = (prefix) => {
  app.use(prefix, authUserRoutes);
  app.use(prefix, clubRoutes);
  app.use(prefix, applicationRoutes);
  app.use(prefix, notificationRoutes);
  app.use(prefix, activityRoutes);
  app.use(prefix, analyticsRoutes);
  app.use(prefix, alumniRoutes);
};

mountAll('/api');
mountAll('/api/v1');

// Global Central Error Handler
app.use(errorHandler);

const PORT = config.server.port;

async function startServer() {
  console.log('==================================================');
  console.log(' Starting AgentVerse AI & Backend Integrated Server');
  console.log('==================================================\n');

  try {
    // 1. Initialize database if MySQL is reachable
    console.log('[Backend Startup] Checking MySQL database readiness...');
    await initializeDatabase();
    console.log('[Backend Startup] Database schema verified.');
  } catch (error) {
    console.warn('\n⚠️ MySQL Server not reachable on port 3306 or credentials invalid.');
    console.warn(`💡 Proceeding with local AI mode and API fallback response handling.\n`);
  }

  // 2. Start listening
  app.listen(PORT, () => {
    console.log(`\n🚀 AgentVerse Backend Server running on http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🤖 AI Engine: Active (OCR + 10 Career Roadmaps + Portfolio Generator)\n`);
  });
}

// Start server if executed directly
if (process.argv[1] && (process.argv[1].endsWith('index.js') || process.argv[1].endsWith('backend\\src\\index.js'))) {
  startServer();
}

export default app;
