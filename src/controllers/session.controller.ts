import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";
import * as sessionService from "../services/session.service";

const createSession = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user!._id;
  const newSession = await sessionService.createSessionService(
    req.body,
    trainerId,
  );

  res
    .status(201)
    .json(new ApiResponse(201, newSession, "Session created successfully"));
});

const updateSession = catchAsync(async (req: Request, res: Response) => {
  const  {id}  = req.params;
  const trainerId = req.user!._id;

  const updatedSession = await sessionService.updateSessionService(
    id as string ,
    req.body,
    trainerId,
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedSession, "Session updated successfully"));
});

const deleteSession = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const trainerId = req.user!._id;

  await sessionService.deleteSessionService(id as string, trainerId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Session deleted successfully"));
});

const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await sessionService.getAllSessionsService(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Sessions fetched successfully"));
});

const getSessionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const session = await sessionService.getSessionByIdService(id as string);

  res
    .status(200)
    .json(new ApiResponse(200, session, "Session fetched successfully"));
});
export {
  createSession,
  updateSession,
  deleteSession,
  getSessionById,
  getAllSessions,
};
