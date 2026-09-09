/**
 * Notification Service — Port 5004
 * Handles: notification feed, unread counts, mark-as-read
 */
import { config } from '../config/env.js';
import { createApp }        from '../config/createApp.js';
import { startService }     from '../config/startService.js';
import notificationRoutes   from '../routes/notificationRoutes.js';

const PORT = config.ports.notification;
const app  = createApp('notification', notificationRoutes);

startService('Notification Service', PORT, app);
