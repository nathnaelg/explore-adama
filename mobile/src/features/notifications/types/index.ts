export interface Notification {
    id: string;
    type: 'booking' | 'event' | 'review' | 'system' | 'promotion';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, any>; // For deep linking or extra data
}

export interface NotificationStats {
    unreadCount: number;
    totalCount: number;
}
