import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const visitors = [
  {
    id: "vis_001",
    fullName: "Chinedu Okafor",
    host: "Dr. Salami",
    status: "checked-in",
    purpose: "Department meeting"
  },
  {
    id: "vis_002",
    fullName: "Grace Taylor",
    host: "Admin Office",
    status: "pending",
    purpose: "Vendor onboarding"
  }
];

export const visitorRouter = Router();

visitorRouter.get("/", requireAuth, (_req, res) => {
  res.json({ success: true, data: visitors });
});

visitorRouter.post("/check-in", requireAuth, requireRole("admin", "security-personnel"), (req, res, next) => {
  try {
    const { fullName, host, purpose } = req.body as Record<string, string>;

    if (!fullName || !host || !purpose) {
      throw new HttpError(400, "Visitor details are incomplete");
    }

    res.status(201).json({
      success: true,
      message: "Visitor checked in",
      data: {
        id: `vis_${Date.now()}`,
        fullName,
        host,
        purpose,
        status: "checked-in",
        qrCode: `QR-${Date.now()}`
      }
    });
  } catch (error) {
    next(error);
  }
});

visitorRouter.post("/check-out", requireAuth, requireRole("admin", "security-personnel"), (req, res, next) => {
  try {
    const { visitorId } = req.body as Record<string, string>;

    if (!visitorId) {
      throw new HttpError(400, "Visitor ID is required");
    }

    res.json({
      success: true,
      message: "Visitor checked out",
      data: {
        visitorId,
        status: "checked-out"
      }
    });
  } catch (error) {
    next(error);
  }
});