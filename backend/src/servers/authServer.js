/**
 * Auth/User Service — Port 5001
 * Handles: login, logout, /auth/me, user profiles, student & teacher profiles
 */
import { config } from '../config/env.js';
import { createApp }    from '../config/createApp.js';
import { startService } from '../config/startService.js';
import authUserRoutes   from '../routes/authUserRoutes.js';

const PORT = config.ports.auth;
const app  = createApp('auth-user', authUserRoutes);

startService('Auth/User Service', PORT, app);
