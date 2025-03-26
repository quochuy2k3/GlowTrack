/**
 * Notification response interface
 */
export interface Notification {
  /** Notification ID */
  id: string;
  /** User ID the notification belongs to */
  userId: string;
  /** Type of notification */
  type: string;
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Read status */
  isRead: boolean;
  /** Optional link or resource associated with the notification */
  link?: string;
  /** Optional data payload */
  data?: Record<string, any>;
  /** Creation date */
  createdAt: string;
  /** Update date */
  updatedAt: string;
}

/**
 * Mark notification read request interface
 */
export interface MarkNotificationReadRequest {
  /** List of notification IDs to mark as read */
  notificationIds: string[];
}
