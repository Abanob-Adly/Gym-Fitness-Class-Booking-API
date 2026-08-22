import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate = (schema: ZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const firstError = result.error.issues[0];
      const fieldName = firstError?.path.slice(1).join(".");
      const errorMessage = `${fieldName}: ${firstError?.message}`;

      return next(new ApiError(400, errorMessage));
    }
    if (result.data.body) req.body = result.data.body;
    if (result.data.query) req.query = result.data.query as any;
    if (result.data.params) req.params = result.data.params as any;

    next();
  };
};
