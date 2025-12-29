import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { NotificationController } from "../modules/notifications/notification.controller.ts";

const router = Router();

// All notification routes require authentication
router.use(auth);

router.get("/", NotificationController.list);
router.get("/stats", NotificationController.getStats);
router.put("/:id/read", NotificationController.markRead);
router.put("/read-all", NotificationController.markAllRead);
router.put("/push-token", NotificationController.updatePushToken);
router.delete("/:id", NotificationController.delete);

export default router;
