import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
export const validateSession = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { capacity, startTime, endTime } = req.body;
  if (capacity === undefined || typeof capacity !== "number" || capacity <= 0) {
    throw new ApiError(400, "capacity must be a number greater than 0");
  }
  if (!startTime) {
    throw(new ApiError(400, "start time is required"));
  }
  const startDate = new Date(startTime);
  if (isNaN(startDate.getTime()) || startDate <= new Date()) {
    throw new ApiError(400, "Start time must be valid date in the future")
  }
  if (!endTime) {
    throw new ApiError(400, "end time is required"));
  }
  const endDate = new Date(endTime);
  if (isNaN(endDate.getTime()) || endDate <= startDate) {
    throw new ApiError(400, "End time must be valid date after the start time");
  }
  req.body.startTime = startDate;
  req.body.endTime = endDate;
  next();
};
