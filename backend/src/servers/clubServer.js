/**
 * Club Service — Port 5002
 * Handles: club listings, members, mentor assignment, student/teacher club views
 */
import { config } from '../config/env.js';
import { createApp }    from '../config/createApp.js';
import { startService } from '../config/startService.js';
import clubRoutes       from '../routes/clubRoutes.js';

const PORT = config.ports.club;
const app  = createApp('club', clubRoutes);

startService('Club Service', PORT, app);
