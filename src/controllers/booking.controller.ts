import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import * as bookingService from "../services/booking.service";

const createBooking = catchAsync(
  async (req: Request, res: Response) => {
    const { sessionId } = req.body;

    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    if (!sessionId) {
      throw new ApiError(400, "Session ID is required");
    }

    const memberId = req.user._id;

    const booking = await bookingService.createBookingService(
      memberId,
      sessionId
    );

    res.status(201).json(
      new ApiResponse(
        201,
        booking,
        "Booking created successfully"
      )
    );
  }
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    const memberId = req.user._id;

    const booking = await bookingService.cancelBookingService(
      bookingId,
      memberId
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

const getMemberBookings = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    const memberId = req.user._id;

    const bookings = await bookingService.getMemberBookingsService(
      memberId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        bookings,
        "Booking history fetched successfully"
      )
    );
  }
);

const getSessionRoster = catchAsync(
  async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;

    if (!req.user) {
      throw new ApiError(401, "You must be logged in");
    }

    const trainerId = req.user._id;

    const bookings = await bookingService.getSessionRosterService(
      sessionId,
      trainerId
    );

    res.status(200).json(
      new ApiResponse(
        200,
        bookings,
        "Session roster fetched successfully"
      )
    );
  }
);

export {
  createBooking,
  cancelBooking,
  getMemberBookings,
  getSessionRoster,
};