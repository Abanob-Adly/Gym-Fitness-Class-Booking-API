import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { getTrainerDashboardStats } from "../services/dashboard.service";
import { ApiResponse } from "../utils/ApiResponse";

const getTrainerDashboard = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user!._id;
  const dashboardData = await getTrainerDashboardStats(trainerId);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardData,
        "Dashboard statstics fetched successfully",
      ),
    );
});

export { getTrainerDashboard };
