import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { analyticsRouter } from "./routes/analytics.js";
import { authRouter } from "./routes/auth.js";
import { healthRouter } from "./routes/health.js";
import { incidentRouter } from "./routes/incidents.js";
import { notificationRouter } from "./routes/notifications.js";
import { reportRouter } from "./routes/reports.js";
import { staffRouter } from "./routes/staff.js";
import { visitorRouter } from "./routes/visitors.js";
import { csrfProtection } from "./middleware/csrf.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { env } from "./lib/env.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 240,
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(csrfProtection);

app.get("/api/v1", (_req, res) => {
  res.json({
    success: true,
    message: "Safety and Security Management API",
    routes: [
      "/api/v1/health",
      "/api/v1/auth",
      "/api/v1/incidents",
      "/api/v1/notifications",
      "/api/v1/visitors",
      "/api/v1/analytics",
      "/api/v1/reports",
      "/api/v1/staff"
    ]
  });
});

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/incidents", incidentRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/visitors", visitorRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/staff", staffRouter);

app.use(notFound);
app.use(errorHandler);