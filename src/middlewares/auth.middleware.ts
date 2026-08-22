import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { catchAsync } from "../utils/catchAsync";
import { token } from "morgan";

const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(
        401,
        "You are not logged in. Please log in to get access",
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new ApiError(
        401,
        "The user belonging to this token no longer exist",
      );
    }
    req.user = currentUser;
    next();
  },
);

const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You don't have permission to perform this action"),
      );
    }
    next();
  };
};

export { protect, restrictTo };
