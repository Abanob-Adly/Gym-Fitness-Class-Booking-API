import { Request, Response } from "express";
import { ClassSession } from "../models/classSession.model";
import { Booking } from "../models/booking.model";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (!req.user) {
    throw new ApiError(401, "You must be logged in");
  }

  const memberId = req.user._id;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

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
      timeSlot: { $gt: new Date() },
      $expr: { $lt: ["$bookedSlots", "$capacity"] },
    },
    {
      $inc: { bookedSlots: 1 },
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

  res.status(201).json(
  new ApiResponse(201, booking, "Booking created successfully")
  );

});

const cancelBooking = catchAsync(()=>{});

export {createBooking,cancelBooking}

