/**
 * Shared Express application factory.
 * Each microservice calls createApp(serviceName, routerFn) to get a fully
 * configured Express instance with CORS, JSON parsing, a /health endpoint,
 * and the service-specific router mounted under /api.
 *
 * The server itself is responsible for calling app.listen(port).
 */

import express from 'express';
import cors from 'cors';
import { getPool } from '../config/db.js';
import { config } from '../config/env.js';
import { errorHandler } from '../middleware/errorHandler.js';

export function createApp(serviceName, mountRouter) {
  const app = express();

  // CORS — allow the frontend origin; falls back to permissive for development
  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.use(cors({ origin: [frontendOrigin, 'http://localhost:3000'], credentials: true }));

  app.use(express.json());

  // ─── Health endpoint (no auth required) ───────────────────────────────────
  app.get('/health', (req, res) => {
    res.json({ service: serviceName, status: 'ok' });
  });

  // ─── DB-connected health check ────────────────────────────────────────────
  app.get('/health/db', async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT 1 + 1 AS r');
      res.json({ service: serviceName, status: 'ok', database: config.db.database, db: rows[0].r === 2 ? 'ok' : 'error' });
    } catch (err) {
      res.status(500).json({ service: serviceName, status: 'error', error: err.message });
    }
  });

  // ─── Mount service routes ─────────────────────────────────────────────────
  app.use('/api', mountRouter);

  // ─── Central error handler ────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
