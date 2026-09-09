import * as notificationService from '../services/notificationService.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.params?.userId || req.user?.id || req.query?.userId || 9;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const userId = req.params?.userId || req.user?.id || req.query?.userId || 9;
    const result = await notificationService.getUnreadCount(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getNotificationById(req, res, next) {
  try {
    const userId = req.user?.id || 9;
    const notification = await notificationService.getNotificationById(userId, req.params.notificationId);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const userId = req.user?.id || req.body?.userId || 9;
    const updated = await notificationService.markNotificationAsRead(userId, req.params.notificationId);
    res.json({ success: true, data: updated, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user?.id || req.body?.userId || 9;
    const result = await notificationService.markAllNotificationsAsRead(userId);
    res.json({ success: true, data: result, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
}
