import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { broadcastNotificationSchema } from "@isms/shared";
import { emitSecurityEvent } from "../lib/socket.js";

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

notificationRouter.post("/broadcast", requireAuth, requireRole("admin", "security-personnel"), async (req, res, next) => {
  try {
    const parsed = broadcastNotificationSchema.parse(req.body);

    const createdNotification = await prisma.notification.create({
      data: {
        title: parsed.title,
        message: parsed.message,
        channel: "WEB_SOCKET" as never,
        userId: null
      }
    });

    res.status(201).json({
      success: true,
      message: "Notification broadcast queued",
      data: {
        ...createdNotification,
        channel: "web-socket"
      }
    });

    emitSecurityEvent("notification:broadcast", {
      notificationId: createdNotification.id,
      title: parsed.title,
      message: parsed.message
    });
  } catch (error) {
    next(error);
  }
});

notificationRouter.patch("/:notificationId/read", requireAuth, (req, res) => {
  const { notificationId } = req.params;

  prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() }
  }).catch(() => undefined);

  res.json({
    success: true,
    message: "Notification marked as read",
    data: { notificationId, read: true }
  });
});