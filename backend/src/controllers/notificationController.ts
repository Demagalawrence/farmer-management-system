import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import logger from '../utils/logger';

// Lazy-load service to avoid database initialization errors
const getNotificationService = () => new NotificationService();

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { limit = 50 } = req.query;

    logger.info(`Fetching notifications for user ${user.id} (${user.role})`);

    const notificationService = getNotificationService();
    const notifications = await notificationService.findByRecipient(user.id, Number(limit));

    logger.info(`Found ${notifications.length} notifications for user ${user.id}`);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error: any) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const notificationService = getNotificationService();
    const count = await notificationService.getUnreadCount(user.id);

    res.status(200).json({
      success: true,
      data: { count }
    });
  } catch (error: any) {
    logger.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { notificationId } = req.params;

    const notificationService = getNotificationService();
    const success = await notificationService.markAsRead(notificationId, user.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error: any) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const notificationService = getNotificationService();
    const count = await notificationService.markAllAsRead(user.id);

    res.status(200).json({
      success: true,
      message: `${count} notifications marked as read`,
      data: { count }
    });
  } catch (error: any) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { notificationId } = req.params;

    const notificationService = getNotificationService();
    const success = await notificationService.delete(notificationId, user.id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error: any) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};
