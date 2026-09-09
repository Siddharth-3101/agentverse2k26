/**
 * Shared Express application factory.
 * Each microservice calls createApp(serviceName, routerFn) to get a fully
 * configured Express instance with CORS, JSON parsing, a /health endpoint,
 * and the service-specific router mounted under /api and /api/v1.
 */

import express from 'express';
import cors from 'cors';
import { getPool } from '../config/db.js';
import { config } from '../config/env.js';
import { errorHandler } from '../middleware/errorHandler.js';

export function createApp(serviceName, mountRouter) {
  const app = express();

  // CORS — allow frontend requests
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ─── Health endpoint (no auth required) ───────────────────────────────────
  app.get(['/health', '/api/health', '/api/v1/health'], (req, res) => {
    res.json({ service: serviceName, status: 'ok', ai: 'ready' });
  });

  // ─── DB-connected health check ────────────────────────────────────────────
  app.get('/health/db', async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT 1 + 1 AS r');
      res.json({ service: serviceName, status: 'ok', database: config.db.database, db: rows[0]?.r === 2 ? 'ok' : 'error' });
    } catch (err) {
      res.status(200).json({ service: serviceName, status: 'degraded', error: err.message });
    }
  });

  // ─── Mount service routes under both /api and /api/v1 ─────────────────────
  app.use('/api', mountRouter);
  app.use('/api/v1', mountRouter);

  // ─── Central error handler ────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
