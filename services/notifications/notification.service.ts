import lmsAPI from '../config/axios';
import { type MarkNotificationReadRequest, type Notification } from '@/models/notification';
import { type PaginationParams, type PaginationResponse } from '@/models/pagination';

/**
 * Notification Service for managing user notifications
 */
export const NotificationService = {
  /**
   * Get all notifications with pagination
   * @param params Query parameters
   */
  find: async (
    params?: PaginationParams & {
      isRead?: boolean;
      type?: string;
    }
  ): Promise<PaginationResponse<Notification>> => {
    const response = await lmsAPI.get('/notifications', { params });
    return response.data;
  },

  /**
   * Get notification by ID
   * @param id Notification ID
   */
  get: async (id: string): Promise<Notification> => {
    const response = await lmsAPI.get(`/notifications/${id}`);
    return response.data;
  },

  /**
   * Mark a notification as read
   * @param id Notification ID
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await lmsAPI.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark multiple notifications as read
   * @param data List of notification IDs to mark as read
   */
  markMultipleAsRead: async (data: MarkNotificationReadRequest): Promise<{ message: string }> => {
    const response = await lmsAPI.put('/notifications/read', data);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await lmsAPI.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await lmsAPI.get('/notifications/unread-count');
    return response.data;
  },
};
