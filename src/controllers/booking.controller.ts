import { Request, Response } from "express";
import mongoose from "mongoose";
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

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
  }

  const memberId = req.user._id;
 
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

const cancelBooking = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    const memberId = req.user._id;

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
      { $inc: { bookedSlots: -1 } }
    );

    res.status(200).json(
      new ApiResponse(
        200,
        booking,
        "Booking cancelled successfully"
      )
    );
  }
);

const getMemberBookings = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "You must be logged in");
  }

  const memberId = req.user._id;

  const bookings = await Booking.find({
    member: memberId,
  }).populate("session");

res.status(200).json(
  new ApiResponse(
    200,
    bookings,
    "Booking history fetched successfully"
  )
);
});

const getSessionRoster = catchAsync(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    const session = await ClassSession.findById(sessionId);

    if (!session) {
      throw new ApiError(404, "Class session not found");
    }

    if (session.trainer.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You can only view bookings for your own sessions"
      );
    }

    const bookings = await Booking.find({
      session: sessionId,
      status: "booked",
    }).populate("member");

    res.status(200).json(
      new ApiResponse(200, bookings, "Session roster fetched successfully")
    );
  }
);

export {createBooking, cancelBooking, getMemberBookings, getSessionRoster}

