import type { ErrorRequestHandler, RequestHandler } from "express";
import { HttpError } from "../lib/http-errors.js";

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, "Route not found"));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    details: error instanceof HttpError ? error.details : undefined
  });
};