import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Safety and Security Management API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});