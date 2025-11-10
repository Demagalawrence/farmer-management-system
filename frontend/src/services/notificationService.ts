import type { Notification, NotificationResponse } from '../types/reports';
import api from './api';

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async (limit: number = 50): Promise<Notification[]> => {
    const response = await api.get('/notifications', {
      params: { limit }
    });
    return response.data.data;
  },

  // Get unread notification count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<NotificationResponse> => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};
