// backend/src/api/routes/booking.routes.ts
import { Router } from "express";
import { auth } from "../middleware/auth.ts";
import { BookingController } from "../modules/booking/booking.controller.ts";

const router = Router();

// initiate booking & payment (auth)
router.post("/initiate", auth, BookingController.initiate);

// list bookings (auth)
router.get("/", auth, BookingController.list);

// view booking
router.get("/:id", auth, BookingController.getOne);

// cancel (auth)
router.post("/:id/cancel", auth, BookingController.cancel);

export default router;
