import type { NextFunction, Request, Response } from "express";
import { env } from "../lib/env.js";
import { HttpError } from "../lib/http-errors.js";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function csrfProtection(req: Request, _res: Response, next: NextFunction) {
  if (!unsafeMethods.has(req.method)) {
    next();
    return;
  }

  const origin = req.header("origin");

  if (origin && origin !== env.APP_ORIGIN) {
    next(new HttpError(403, "Blocked by CSRF protection"));
    return;
  }

  next();
}