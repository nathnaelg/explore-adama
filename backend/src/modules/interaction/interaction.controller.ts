// backend/src/modules/interaction/interaction.controller.ts
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import { InteractionService } from "./interaction.service.ts";

export class InteractionController {
  static async record(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.sub; // optional
      const { itemId, itemType, type, context } = req.body;

      const data = await InteractionService.record({
        userId,
        itemId,
        itemType,
        type,
        context
      });

      res.status(201).json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.sub;
      const data = await InteractionService.list(userId);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
