import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { ApiResponse } from '../utils/ApiResponse';
import * as sessionService from '../services/session.service';
import { ApiError } from '../utils/ApiError';

export const createSession = catchAsync(async (req: Request, res: Response) => {
  const sessionData = {
    ...req.body,
    trainerId: (req as any).user._id
  };

  const newSession = await sessionService.createSessionService(sessionData);

  res.status(201).json(new ApiResponse(201, newSession, "Session created successfully"));
});

export const updateSession = catchAsync(async (req: Request, res: Response) => {
  const id  = req.params.id as string;
  const trainerId = (req as any).user._id;
  
  const updatedSession = await sessionService.updateSessionService(id, req.body, trainerId);

  res.status(200).json(new ApiResponse(200, updatedSession, "Session updated successfully"));
});

export const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const    id  = req.params.id as string;
  const trainerId = (req as any).user._id;

  await sessionService.deleteSessionService(id, trainerId);

  res.status(200).json(new ApiResponse(200, null, "Session deleted successfully"));
});

export const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await sessionService.getAllSessionsService(req.query);

  res.status(200).json(new ApiResponse(200, result, "Sessions fetched successfully"));
});
export const getSessionById = catchAsync(
  async (req: Request, res: Response) => {
    const  id = req.params.id as string;
    const session = await sessionService.getSessionByIdService(id);

    
    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  }
);
