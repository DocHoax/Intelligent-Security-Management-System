import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

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

incidentRouter.post("/", requireAuth, requireRole("admin", "staff", "visitor"), (req, res, next) => {
  try {
    const { type, title, description, location, priority } = req.body as Record<string, string>;

    if (!type || !title || !description || !location) {
      throw new HttpError(400, "Incident form is incomplete");
    }

    res.status(201).json({
      success: true,
      message: "Incident captured",
      data: {
        incident: {
          id: `inc_${Date.now()}`,
          type,
          title,
          description,
          location,
          priority: priority ?? "medium",
          status: "open",
          createdBy: req.user?.fullName ?? req.user?.email ?? "Unknown"
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

incidentRouter.patch("/:incidentId/status", requireAuth, requireRole("admin", "security-personnel"), (req, res, next) => {
  try {
    const { incidentId } = req.params;
    const { status } = req.body as Record<string, string>;

    if (!status) {
      throw new HttpError(400, "Status is required");
    }

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