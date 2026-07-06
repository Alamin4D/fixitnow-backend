import { ErrorRequestHandler } from "express";
import config from "../config";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails: any = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = [{ path: "", message: err.message }];
  }

  // Prisma duplicate key error
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate entry. A record with this value already exists.";
    errorDetails = [{ path: err.meta?.target, message }];
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
    errorDetails = [{ path: "", message }];
  }

  
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: config.port === "development" ? err.stack : undefined,
  });
};

export default globalErrorHandler;