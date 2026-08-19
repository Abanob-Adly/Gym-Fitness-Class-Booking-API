import { Request, Response } from 'express';
import { ClassSession } from "../models/classSession.model";
import { Booking } from "../models/booking.model";
import { catchAsync } from '../utils/catchAsync';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const createBooking = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const memberId = req.user._id;

  if (!sessionId) {
    throw new ApiError(400, "Session ID is required");
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
});