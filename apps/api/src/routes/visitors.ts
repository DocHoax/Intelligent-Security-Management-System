import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { visitorCheckInSchema } from "@isms/shared";
import { emitSecurityEvent } from "../lib/socket.js";
import { logAudit } from "../lib/audit.js";

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

visitorRouter.post("/check-in", requireAuth, requireRole("admin", "security-personnel"), async (req, res, next) => {
  try {
    const parsed = visitorCheckInSchema.parse(req.body);

    const createdVisitor = await prisma.visitor.create({
      data: {
        fullName: parsed.fullName,
        hostName: parsed.host,
        purpose: parsed.purpose,
        status: "CHECKED_IN" as never,
        hostUserId: req.user?.id ?? null,
        checkInAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: "Visitor checked in",
      data: {
        ...createdVisitor,
        qrCode: `QR-${createdVisitor.id}`
      }
    });

    emitSecurityEvent("visitor:checked-in", {
      visitorId: createdVisitor.id,
      hostName: createdVisitor.hostName,
      purpose: createdVisitor.purpose
    });

    await logAudit({
      actorId: req.user?.id,
      action: "check_in",
      entityType: "Visitor",
      entityId: createdVisitor.id,
      metadata: {
        hostName: createdVisitor.hostName,
        purpose: createdVisitor.purpose
      }
    });
  } catch (error) {
    next(error);
  }
});

visitorRouter.post("/check-out", requireAuth, requireRole("admin", "security-personnel"), async (req, res, next) => {
  try {
    const { visitorId } = req.body as Record<string, string>;

    if (!visitorId) {
      throw new HttpError(400, "Visitor ID is required");
    }

    await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        status: "CHECKED_OUT" as never,
        checkOutAt: new Date()
      }
    });

    emitSecurityEvent("visitor:checked-out", {
      visitorId,
      status: "checked-out"
    });

    await logAudit({
      actorId: req.user?.id,
      action: "check_out",
      entityType: "Visitor",
      entityId: visitorId
    });

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