import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { ApiResponse } from "../utils/ApiResponse";

const register = catchAsync(async (req: Request, res: Response) => {
  const registered = await registerUser(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, registered, "User registered successfully"));
});

const login = catchAsync(async (req: Request, res: Response) => {
  const loggedIn = await loginUser(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, loggedIn, "Logged in successfully"));
});

export { register, login };
