import {Router} from "express";
import {createBooking, cancelBooking, getMemberBookings, getSessionRoster}from "../controllers/booking.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware" ;
const bookingRouter = Router();

// member can book a spot in a session
bookingRouter.post("/",protect,restrictTo("member"),createBooking);

// member can cancel a booked session
bookingRouter.patch("/:bookingId/cancel",protect,restrictTo("member"),cancelBooking);

// member can view his bookings 
bookingRouter.get("/my-bookings",protect,restrictTo("member"),getMemberBookings)

// trainer can view bookings for his session
bookingRouter.get("/:sessionId/roster",protect,restrictTo("trainer"),getSessionRoster)

export default bookingRouter;