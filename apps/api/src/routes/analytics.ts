import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", requireAuth, (_req, res) => {
  res.json({
    success: true,
    data: {
      incidentsByMonth: [18, 24, 31, 29, 34, 22],
      incidentTypes: [
        { label: "Fire", value: 18 },
        { label: "Theft", value: 27 },
        { label: "Unauthorized Access", value: 25 },
        { label: "Medical", value: 30 }
      ],
      responseTimes: [14, 12, 10, 9, 11, 8],
      activeStaff: 86,
      alertsHandled: 432
    }
  });
});