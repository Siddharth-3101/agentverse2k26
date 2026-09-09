/**
 * Activity Service — Port 5005
 * Handles: activities CRUD, student activity registration, club activities, certificates
 */
import { config } from '../config/env.js';
import { createApp }    from '../config/createApp.js';
import { startService } from '../config/startService.js';
import activityRoutes   from '../routes/activityRoutes.js';

const PORT = config.ports.activity;
const app  = createApp('activity', activityRoutes);

startService('Activity Service', PORT, app);
