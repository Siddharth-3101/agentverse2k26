import * as notificationService from '../services/notificationService.js';

export async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getNotificationById(req, res, next) {
  try {
    const notification = await notificationService.getNotificationById(req.user.id, req.params.notificationId);
    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const updated = await notificationService.markNotificationAsRead(req.user.id, req.params.notificationId);
    res.json({ success: true, data: updated, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const result = await notificationService.markAllNotificationsAsRead(req.user.id);
    res.json({ success: true, data: result, message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
}
