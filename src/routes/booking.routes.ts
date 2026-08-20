import {Router} from "express";
import {createBooking, cancelBooking, getMemberBookings, getTrainerBoookedSpots}from "../controllers/booking.controller";

const bookingRouter = Router();

// member can book a spot in a session
bookingRouter.post("/", createBooking);

// member can cancel a booked session
bookingRouter.patch("/:id/cancel", cancelBooking);

// member can view his bookings 
bookingRouter.get("/my-bookings", getMemberBookings)

// trainer can view bookings for his session
bookingRouter.get("/:id/roster", getTrainerBoookedSpots)

export default bookingRouter;