/**
 * Analytics Service — Port 5006
 * Handles: teacher dashboard, club analytics, department distribution,
 *          membership growth, leaderboard
 */
import { config } from '../config/env.js';
import { createApp }    from '../config/createApp.js';
import { startService } from '../config/startService.js';
import analyticsRoutes  from '../routes/analyticsRoutes.js';

const PORT = config.ports.analytics;
const app  = createApp('analytics', analyticsRoutes);

startService('Analytics Service', PORT, app);
