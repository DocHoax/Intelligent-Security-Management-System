import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/http-errors.js";

export const allowedRoles = ["admin", "security-personnel", "staff", "visitor"] as const;

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    next(new HttpError(401, "Authentication required"));
    return;
  }

  const token = authorization.slice(7).trim();
  const [role = "visitor", id = "demo-user"] = token.split(":");

  req.user = {
    id,
    role,
    email: `${id}@example.com`,
    fullName: "Demo User"
  };

  next();
}

export function requireRole(...roles: (typeof allowedRoles)[number][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpError(401, "Authentication required"));
      return;
    }

    if (!roles.includes(req.user.role as (typeof allowedRoles)[number])) {
      next(new HttpError(403, "Insufficient permissions"));
      return;
    }

    next();
  };
}