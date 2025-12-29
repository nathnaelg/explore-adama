import type { Request, Response } from "express";
import { NotificationService } from "./notification.service.ts";

export class NotificationController {
    static async list(req: Request, res: Response) {
        try {
            // @ts-ignore - user added by auth middleware
            const userId = req.user.sub;
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

            const result = await NotificationService.getUserNotifications(userId, page, limit);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getStats(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.sub;
            const stats = await NotificationService.getStats(userId);
            res.json(stats);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async markRead(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.sub;
            const { id } = req.params;
            await NotificationService.markAsRead(id, userId);
            res.json({ success: true });
        } catch (error: any) {
            if (error.message === "Forbidden") {
                res.status(403).json({ error: "Forbidden" });
            } else if (error.message === "Notification not found") {
                res.status(404).json({ error: "Not found" });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async markAllRead(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.sub;
            await NotificationService.markAllAsRead(userId);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.sub;
            const { id } = req.params;
            await NotificationService.deleteNotification(id, userId);
            res.json({ success: true });
        } catch (error: any) {
            if (error.message === "Forbidden") {
                res.status(403).json({ error: "Forbidden" });
            } else if (error.message === "Notification not found") {
                res.status(404).json({ error: "Not found" });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    static async updatePushToken(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.sub;
            const { pushToken } = req.body;

            if (!pushToken) {
                return res.status(400).json({ error: "pushToken is required" });
            }

            await NotificationService.updatePushToken(userId, pushToken);
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
