import type { NotificationType } from "@prisma/client";
import { createRequire } from "module";
import { prisma } from "../../config/db.ts";
const require = createRequire(import.meta.url);
const { Prisma } = require("@prisma/client");

export class NotificationService {
    /**
     * Create a notification for a user.
     * This is intended to be called by other services internally.
     */
    static async createNotification(params: {
        userId: string;
        type: NotificationType;
        title: string;
        message: string;
        data?: any;
    }) {
        const { userId, type, title, message, data } = params;

        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                data: data ?? Prisma.JsonNull,
                isRead: false
            }
        });

        // Trigger push notification if user has a push token
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { pushToken: true }
            });

            if (user?.pushToken) {
                const { ExpoPushUtils } = await import("../../utils/expo-push.ts");
                await ExpoPushUtils.sendPushNotification({
                    to: user.pushToken,
                    title,
                    body: message,
                    data: data
                });
            }
        } catch (pushError) {
            console.error("Failed to send push notification:", pushError);
            // We don't throw here to avoid failing the whole operation if push fails
        }

        // TODO: Integrate with Real-time socket/push notification here if needed
        // e.g. socketService.emitToUser(userId, 'notification', notification);

        return notification;
    }

    /**
     * Get notifications for a user with pagination
     */
    static async getUserNotifications(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.notification.count({ where: { userId } })
        ]);

        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false }
        });

        return {
            data: notifications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            unreadCount
        };
    }

    /**
     * Get notification stats (unread count)
     */
    static async getStats(userId: string) {
        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false }
        });
        const totalCount = await prisma.notification.count({
            where: { userId }
        });

        return { unreadCount, totalCount };
    }

    /**
     * Mark a single notification as read
     */
    static async markAsRead(notificationId: string, userId: string) {
        // Verify ownership
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            throw new Error("Notification not found");
        }

        if (notification.userId !== userId) {
            throw new Error("Forbidden");
        }

        return prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    static async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    /**
     * Delete a notification
     */
    static async deleteNotification(notificationId: string, userId: string) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });

        if (!notification) {
            throw new Error("Notification not found");
        }

        if (notification.userId !== userId) {
            throw new Error("Forbidden");
        }

        return prisma.notification.delete({
            where: { id: notificationId }
        });
    }

    /**
     * Update user's push token
     */
    static async updatePushToken(userId: string, pushToken: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { pushToken }
        });
    }
}
