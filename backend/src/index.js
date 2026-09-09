import express from 'express';
import cors from 'cors';
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

const app = express();

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({
      status: 'UP',
      database: config.db.database,
      dbConnection: rows[0].result === 2 ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'DOWN',
      database: config.db.database,
      error: error.message,
    });
  }
});

// Manual Database Re-initialization & Seed endpoint
app.post('/api/db/init', async (req, res, next) => {
  try {
    const tables = await initializeDatabase();
    if (req.body.seed) {
      await seedDatabase();
    }
    res.json({ success: true, message: 'Database schema initialized.', tables });
  } catch (error) {
    next(error);
  }
});

// Mount Backend Service Routers
app.use('/api', authUserRoutes);
app.use('/api', clubRoutes);
app.use('/api', applicationRoutes);
app.use('/api', notificationRoutes);
app.use('/api', activityRoutes);
app.use('/api', analyticsRoutes);

// Global Central Error Handler
app.use(errorHandler);

const PORT = config.server.port;

async function startServer() {
  console.log('==================================================');
  console.log(' Starting AgentVerse Backend Service Suite');
  console.log('==================================================\n');

  try {
    // 1. Initialize database BEFORE starting Express server
    console.log('[Backend Startup] Verifying MySQL database readiness...');
    await initializeDatabase();
    console.log('[Backend Startup] Database schema verified.');

    // 2. Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 AgentVerse Backend Server running on http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('\n❌ Server startup halted due to database initialization failure.');
    console.error(`💡 Please check 'backend/.env' database credentials and ensure MySQL service is running.\n`);
    process.exit(1);
  }
}

startServer();
