import { Router } from "express";
import {
  createBooking,
  cancelBooking,
  getMemberBookings,
  getSessionRoster,
} from "../controllers/booking.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect, restrictTo("member"));
// member can book a spot in a session
router.post("/", createBooking);

// member can cancel a booked session
router.patch("/:bookingId/cancel", cancelBooking);

// member can view his bookings
router.get("/my-bookings", getMemberBookings);

// trainer can view bookings for his session
router.get("/:sessionId/roster", getSessionRoster);

export default router;