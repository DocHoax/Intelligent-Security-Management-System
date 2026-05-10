import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { reportGenerateSchema } from "@isms/shared";
import { emitSecurityEvent } from "../lib/socket.js";
import { logAudit } from "../lib/audit.js";

export const reportRouter = Router();

reportRouter.get("/summary", requireAuth, (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: "rep_001", title: "Monthly Incident Report", format: "pdf" },
      { id: "rep_002", title: "Staff Performance Report", format: "excel" }
    ]
  });
});

reportRouter.post("/generate", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const parsed = reportGenerateSchema.parse(req.body);

    const createdReport = await prisma.report.create({
      data: {
        generatedById: req.user!.id,
        title: parsed.title,
        format: parsed.format.toUpperCase() as never,
        fileUrl: `/exports/${Date.now()}.${parsed.format}`
      }
    });

    res.status(201).json({
      success: true,
      message: "Report generation queued",
      data: {
        ...createdReport,
        format: parsed.format
      }
    });

    emitSecurityEvent("report:generated", {
      reportId: createdReport.id,
      title: parsed.title,
      format: parsed.format,
      generatedBy: req.user?.fullName
    });

    await logAudit({
      actorId: req.user?.id,
      action: "export",
      entityType: "Report",
      entityId: createdReport.id,
      metadata: {
        title: parsed.title,
        format: parsed.format
      }
    });
  } catch (error) {
    next(error);
  }
});

reportRouter.get("/export/:format", requireAuth, (req, res, next) => {
  try {
    const format = req.params.format.toLowerCase();

    if (format !== "pdf" && format !== "excel") {
      throw new HttpError(400, "Export format must be pdf or excel");
    }

    res.json({
      success: true,
      message: `Export prepared in ${format.toUpperCase()} format`,
      data: {
        downloadUrl: `/exports/sample.${format}`
      }
    });

    void logAudit({
      actorId: req.user?.id,
      action: "export",
      entityType: "Report",
      entityId: format,
      metadata: {
        format
      }
    });
  } catch (error) {
    next(error);
  }
});