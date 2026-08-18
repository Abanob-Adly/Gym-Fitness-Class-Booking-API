import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Helper Functions
const validateAndSanitizeEmail = (email: unknown): string => {
  if (typeof email !== "string")
    throw new ApiError(400, "Email must be a valid string");
  const sanitized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!sanitized || !emailRegex.test(sanitized)) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  return sanitized;
};

const validateAndSanitizePassword = (
  password: unknown,
  minLength = 8,
): string => {
  if (typeof password !== "string")
    throw new ApiError(400, "Password must be a valid string");
  const sanitized = password.trim();
  if (!sanitized || sanitized.length < minLength) {
    throw new ApiError(
      400,
      `Password must be at least ${minLength} characters long`,
    );
  }
  return sanitized;
};

// Middlewares
const validateRegister = (req: Request, _res: Response, next: NextFunction) => {
  let { name, role } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Name is required and cannot be empty");
  }

  req.body.name = name.trim();
  req.body.email = validateAndSanitizeEmail(req.body.email);
  req.body.password = validateAndSanitizePassword(req.body.password);

  if (role) {
    const validRoles = ["trainer", "member"];
    if (!validRoles.includes(role)) {
      throw new ApiError(
        400,
        `Invalid role. Allowed roles are: ${validRoles.join(", ")}`,
      );
    }
  } else {
    req.body.role = "member";
  }

  next();
};

const validateLogin = (req: Request, _res: Response, next: NextFunction) => {
  req.body.email = validateAndSanitizeEmail(req.body.email);
  req.body.password = validateAndSanitizePassword(req.body.password);
  next();
};

export { validateRegister, validateLogin };
