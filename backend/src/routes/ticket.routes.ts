// backend/src/api/routes/ticket.routes.ts
import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { TicketController } from "../modules/tickets/ticket.controller.ts";

const router = Router();

// List all tickets for authenticated user
router.get("/", auth, TicketController.list);

// Get specific ticket by ID
router.get("/:id", auth, TicketController.getOne);

// Validate ticket (public endpoint for validators)
router.post("/validate", TicketController.validate);

export default router;
