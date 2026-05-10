import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const notifications = [
  {
    id: "not_001",
    title: "Emergency alert acknowledged",
    message: "Security personnel are en route to the engineering block.",
    channel: "web-socket",
    read: false
  },
  {
    id: "not_002",
    title: "Visitor pass generated",
    message: "QR code visitor badge created for scheduled access.",
    channel: "in-app",
    read: true
  }
];

export const notificationRouter = Router();

notificationRouter.get("/", requireAuth, (_req, res) => {
  res.json({ success: true, data: notifications });
});

notificationRouter.post("/broadcast", requireAuth, requireRole("admin", "security-personnel"), (req, res, next) => {
  try {
    const { title, message } = req.body as Record<string, string>;

    if (!title || !message) {
      throw new HttpError(400, "Title and message are required");
    }

    res.status(201).json({
      success: true,
      message: "Notification broadcast queued",
      data: {
        id: `not_${Date.now()}`,
        title,
        message,
        channel: "web-socket"
      }
    });
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/:notificationId/read", requireAuth, (req, res) => {
  const { notificationId } = req.params;

  res.json({
    success: true,
    message: "Notification marked as read",
    data: { notificationId, read: true }
  });
});