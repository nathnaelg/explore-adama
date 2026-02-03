export interface Notification {
    id: string;
    type: 'BOOKING' | 'PAYMENT' | 'EVENT' | 'REVIEW' | 'SYSTEM' | 'PROMOTION' | 'SOCIAL';
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: Record<string, any>;
}

export interface NotificationStats {
    unreadCount: number;
    totalCount: number;
}
