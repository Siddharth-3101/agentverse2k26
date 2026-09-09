import { getPool } from '../config/db.js';

export async function getUserNotifications(userId) {
  const pool = getPool();
  const [notifications] = await pool.query(
    `SELECT n.*, a.club_id, c.name as club_name 
     FROM notifications n 
     LEFT JOIN applications a ON n.application_id = a.id 
     LEFT JOIN clubs c ON a.club_id = c.id 
     WHERE n.recipient_user_id = ? 
     ORDER BY n.created_at DESC`,
    [userId]
  );
  return notifications;
}

export async function getUnreadCount(userId) {
  const pool = getPool();
  const [result] = await pool.query(
    `SELECT COUNT(*) as count FROM notifications WHERE recipient_user_id = ? AND is_read = FALSE`,
    [userId]
  );
  return { unreadCount: result[0].count };
}

export async function getNotificationById(userId, notificationId) {
  const pool = getPool();
  const [notifications] = await pool.query(
    `SELECT * FROM notifications WHERE id = ? AND recipient_user_id = ?`,
    [notificationId, userId]
  );

  if (notifications.length === 0) {
    throw { status: 404, message: 'Notification not found or access denied.' };
  }

  return notifications[0];
}

export async function markNotificationAsRead(userId, notificationId) {
  const pool = getPool();
  
  // Verify ownership
  await getNotificationById(userId, notificationId);

  await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE id = ? AND recipient_user_id = ?`,
    [notificationId, userId]
  );

  return getNotificationById(userId, notificationId);
}

export async function markAllNotificationsAsRead(userId) {
  const pool = getPool();
  const [result] = await pool.query(
    `UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = ? AND is_read = FALSE`,
    [userId]
  );
  return { success: true, updatedCount: result.affectedRows };
}
