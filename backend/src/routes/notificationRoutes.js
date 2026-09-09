import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.get('/notifications', authenticateUser, notificationController.getNotifications);
router.get('/notifications/unread-count', authenticateUser, notificationController.getUnreadCount);
router.get('/notifications/:notificationId', authenticateUser, notificationController.getNotificationById);
router.patch('/notifications/:notificationId/read', authenticateUser, notificationController.markAsRead);
router.patch('/notifications/read-all', authenticateUser, notificationController.markAllAsRead);

export default router;
