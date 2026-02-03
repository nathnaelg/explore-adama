import { apiClient } from '@/src/core/api/client';
import { Notification, NotificationStats } from '../types';

export const notificationService = {
    // Get all notifications
    async getNotifications(page = 1, limit = 20): Promise<{ data: Notification[], total: number, page: number, totalPages: number }> {
        const response = await apiClient.get('/notifications', { params: { page, limit } });
        return response.data;
    },

    // Get notification stats (unread count)
    async getStats(): Promise<NotificationStats> {
        const response = await apiClient.get('/notifications/stats');
        return response.data;
    },

    // Mark single notification as read
    async markAsRead(id: string): Promise<void> {
        await apiClient.put(`/notifications/${id}/read`);
    },

    // Mark all as read
    async markAllAsRead(): Promise<void> {
        await apiClient.put('/notifications/read-all');
    },

    // Delete a notification
    async deleteNotification(id: string): Promise<void> {
        await apiClient.delete(`/notifications/${id}`);
    }
};
