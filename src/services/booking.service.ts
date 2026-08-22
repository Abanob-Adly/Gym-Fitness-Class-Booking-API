import { ClassSession } from "../models/classSession.model";
import { Booking } from "../models/booking.model";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";

const createBookingService = async (
  memberId: Types.ObjectId,
  sessionId: string
) => {
  const existingBooking = await Booking.findOne({
    session: sessionId,
    member: memberId,
    status: "booked",
  });

  if (existingBooking) {
    throw new ApiError(400, "You have already booked this session");
  }

  const session = await ClassSession.findOneAndUpdate(
    {
      _id: sessionId,
      startTime: { $gt: new Date() },
      $expr: {
        $lt: ["$bookedSlots", "$capacity"],
      },
    },
    {
      $inc: {
        bookedSlots: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!session) {
    throw new ApiError(400, "Session is full or unavailable");
  }

  const booking = await Booking.create({
    session: session._id,
    member: memberId,
    status: "booked",
  });

  return booking;
};


const cancelBookingService = async (
  bookingId: string,
  memberId: Types.ObjectId
) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    member: memberId,
    status: "booked",
  });

  if (!booking) {
    throw new ApiError(404, "Active booking not found");
  }

  booking.status = "cancelled";
  await booking.save();

  await ClassSession.findByIdAndUpdate(
    booking.session,
    {
      $inc: {
        bookedSlots: -1,
      },
    }
  );

  return booking;
};


const getMemberBookingsService = async (memberId: Types.ObjectId) => {
  const bookings = await Booking.find({
    member: memberId,
  }).populate("session");

  return bookings;
};


const getSessionRosterService = async (
  sessionId: string,
  trainerId: Types.ObjectId
) => {
  const session = await ClassSession.findById(sessionId);

  if (!session) {
    throw new ApiError(404, "Class session not found");
  }

  if (session.trainerId.toString() !== trainerId.toString()) { 
    throw new ApiError(
      403,
      "You can only view bookings for your own sessions"
    );
  }

  const bookings = await Booking.find({
    session: sessionId,
    status: "booked",
  }).populate("member");

  return bookings;
};


export {
  createBookingService,
  cancelBookingService,
  getMemberBookingsService,
  getSessionRosterService,
};