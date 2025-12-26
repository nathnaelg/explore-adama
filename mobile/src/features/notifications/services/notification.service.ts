import { Notification, NotificationStats } from '../types';

export const notificationService = {
    // Get all notifications
    async getNotifications(page = 1, limit = 20): Promise<{ data: Notification[], total: number, page: number, totalPages: number }> {
        // API Endpoint Missing. Returning empty list.
        console.warn('Notifications API not implemented in backend.');
        return { data: [], total: 0, page: 1, totalPages: 1 };
    },

    // Get notification stats (unread count)
    // Get notification stats (unread count)
    async getStats(): Promise<NotificationStats> {
        // Stubbed response
        return { unreadCount: 0, totalCount: 0 };
    },

    // Mark single notification as read
    async markAsRead(id: string): Promise<void> {
        // no-op
    },

    // Mark all as read
    async markAllAsRead(): Promise<void> {
        // no-op
    },

    // Delete a notification
    async deleteNotification(id: string): Promise<void> {
        // no-op
    }
};
