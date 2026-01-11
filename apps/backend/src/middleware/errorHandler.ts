import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { AppError } from "../lib/AppError.js";
import { ZodError } from "zod";
import z from "zod";

export const globalErrorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    origin: req.headers.origin,
  });

  if (err instanceof ZodError) {
    const flattened = z.flattenError(err);
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: flattened.fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: "error",
    statusCode: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
};
