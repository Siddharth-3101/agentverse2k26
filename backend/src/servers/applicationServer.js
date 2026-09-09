/**
 * Application Service — Port 5003
 * Handles: application submission, student views, teacher review (accept/reject)
 */
import { config } from '../config/env.js';
import { createApp }       from '../config/createApp.js';
import { startService }    from '../config/startService.js';
import applicationRoutes   from '../routes/applicationRoutes.js';

const PORT = config.ports.application;
const app  = createApp('application', applicationRoutes);

startService('Application Service', PORT, app);
