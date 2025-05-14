import {ApiError} from "../utils/apiError";
import {Request, Response, NextFunction} from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Url Not Found ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // For other unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
  });
};
