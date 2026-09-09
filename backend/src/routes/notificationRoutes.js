import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticateUser(req, res, next);
  }
  next();
};

router.get(['/notifications', '/notification'], optionalAuth, notificationController.getNotifications);
router.get(['/notifications/user/:userId', '/user/:userId/notifications', '/users/:userId/notifications'], optionalAuth, notificationController.getNotifications);
router.get(['/notifications/unread-count', '/notifications/unread'], optionalAuth, notificationController.getUnreadCount);
router.get('/notifications/:notificationId', optionalAuth, notificationController.getNotificationById);
router.patch(['/notifications/:notificationId/read', '/notifications/:notificationId'], optionalAuth, notificationController.markAsRead);
router.put(['/notifications/:notificationId/read', '/notifications/:notificationId'], optionalAuth, notificationController.markAsRead);
router.patch('/notifications/read-all', optionalAuth, notificationController.markAllAsRead);
router.put('/notifications/read-all', optionalAuth, notificationController.markAllAsRead);

export default router;

