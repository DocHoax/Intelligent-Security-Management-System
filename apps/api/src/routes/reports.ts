import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

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

reportRouter.post("/generate", requireAuth, requireRole("admin"), (req, res, next) => {
  try {
    const { title, format } = req.body as Record<string, string>;

    if (!title || !format) {
      throw new HttpError(400, "Report title and format are required");
    }

    res.status(201).json({
      success: true,
      message: "Report generation queued",
      data: {
        id: `rep_${Date.now()}`,
        title,
        format,
        fileUrl: `/exports/${Date.now()}.${format}`
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
  } catch (error) {
    next(error);
  }
});