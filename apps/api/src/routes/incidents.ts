import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { incidentCreateSchema } from "@isms/shared";
import { emitSecurityEvent } from "../lib/socket.js";
import { logAudit } from "../lib/audit.js";
import { buildEvidenceUrl, incidentEvidenceUpload } from "../lib/uploads.js";

const incidents = [
  {
    id: "inc_001",
    type: "fire",
    title: "Library wing smoke alert",
    location: "Main Library",
    priority: "high",
    status: "open",
    reportedBy: "Amina Yusuf",
    createdAt: "2026-05-10T08:30:00.000Z"
  },
  {
    id: "inc_002",
    type: "unauthorized-access",
    title: "Restricted lab access attempt",
    location: "Engineering Block",
    priority: "critical",
    status: "in-review",
    reportedBy: "Security Desk",
    createdAt: "2026-05-10T09:10:00.000Z"
  }
];

export const incidentRouter = Router();

incidentRouter.get("/", requireAuth, (req, res) => {
  const { q = "", status, priority } = req.query as Record<string, string>;
  const search = q.trim().toLowerCase();

  const filtered = incidents.filter((incident) => {
    const matchesQuery = !search || [incident.title, incident.location, incident.type, incident.reportedBy]
      .join(" ")
      .toLowerCase()
      .includes(search);

    const matchesStatus = !status || incident.status === status;
    const matchesPriority = !priority || incident.priority === priority;

    return matchesQuery && matchesStatus && matchesPriority;
  });

  res.json({ success: true, data: filtered });
});

incidentRouter.post("/", requireAuth, requireRole("admin", "staff", "visitor"), async (req, res, next) => {
  try {
    const parsed = incidentCreateSchema.parse(req.body);
    const createdIncident = await prisma.incident.create({
      data: {
        reporterId: req.user!.id,
        type: parsed.type.toUpperCase().replace(/-/g, "_") as never,
        title: parsed.title,
        description: parsed.description,
        location: parsed.location,
        priority: parsed.priority.toUpperCase() as never,
        occurredAt: parsed.occurredAt ? new Date(parsed.occurredAt) : new Date(),
        status: "OPEN" as never
      }
    });

    res.status(201).json({
      success: true,
      message: "Incident captured",
      data: {
        incident: {
          ...createdIncident,
          createdBy: req.user?.fullName ?? req.user?.email ?? "Unknown"
        }
      }
    });

    emitSecurityEvent("incident:created", {
      incidentId: createdIncident.id,
      type: parsed.type,
      priority: parsed.priority,
      reporterId: req.user?.id,
      reporterName: req.user?.fullName
    });

    await logAudit({
      actorId: req.user?.id,
      action: "create",
      entityType: "Incident",
      entityId: createdIncident.id,
      metadata: {
        type: parsed.type,
        priority: parsed.priority,
        location: parsed.location
      }
    });
  } catch (error) {
    next(error);
  }
});

incidentRouter.patch("/:incidentId/status", requireAuth, requireRole("admin", "security-personnel"), async (req, res, next) => {
  try {
    const incidentId = String(req.params.incidentId);
    const { status } = req.body as Record<string, string>;

    if (!status) {
      throw new HttpError(400, "Status is required");
    }

    await prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: status.toUpperCase().replace(/-/g, "_") as never,
        assignedToId: req.user?.id ?? undefined
      }
    });

    emitSecurityEvent("incident:updated", {
      incidentId,
      status,
      updatedBy: req.user?.fullName ?? "System"
    });

    await logAudit({
      actorId: req.user?.id,
      action: "update",
      entityType: "Incident",
      entityId: incidentId,
      metadata: {
        status
      }
    });

    res.json({
      success: true,
      message: "Incident status updated",
      data: {
        incidentId,
        status,
        updatedBy: req.user?.fullName ?? "System"
      }
    });
  } catch (error) {
    next(error);
  }
});

incidentRouter.post(
  "/:incidentId/evidence",
  requireAuth,
  requireRole("admin", "security-personnel", "staff"),
  incidentEvidenceUpload.single("file"),
  async (req, res, next) => {
    try {
      const incidentId = String(req.params.incidentId);

      if (!req.file) {
        throw new HttpError(400, "Evidence file is required");
      }

      const evidenceType = req.file.mimetype.startsWith("image/")
        ? "image"
        : req.file.mimetype.startsWith("video/")
          ? "video"
          : "document";
      const attachmentUrl = buildEvidenceUrl(req.file.originalname);

      await prisma.incident.update({
        where: { id: incidentId },
        data: {
          attachmentUrl,
          evidenceType: evidenceType.toUpperCase() as never
        }
      });

      await logAudit({
        actorId: req.user?.id,
        action: "update",
        entityType: "Incident",
        entityId: incidentId,
        metadata: {
          attachmentUrl,
          evidenceType
        }
      });

      res.status(201).json({
        success: true,
        message: "Incident evidence uploaded",
        data: {
          incidentId,
          attachmentUrl,
          evidenceType
        }
      });
    } catch (error) {
      next(error);
    }
  }
);