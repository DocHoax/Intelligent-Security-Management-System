import { Router } from "express";
import { HttpError } from "../lib/http-errors.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const staffMembers = [
  {
    id: "sec_001",
    fullName: "Inspector Musa",
    rank: "Supervisor",
    shift: "Morning",
    status: "on-duty"
  },
  {
    id: "sec_002",
    fullName: "Officer Nwosu",
    rank: "Patrol",
    shift: "Night",
    status: "off-duty"
  }
];

export const staffRouter = Router();

staffRouter.get("/", requireAuth, (_req, res) => {
  res.json({ success: true, data: staffMembers });
});

staffRouter.post("/", requireAuth, requireRole("admin"), (req, res, next) => {
  try {
    const { fullName, rank, shift } = req.body as Record<string, string>;

    if (!fullName || !rank || !shift) {
      throw new HttpError(400, "Security staff details are incomplete");
    }

    res.status(201).json({
      success: true,
      message: "Security staff member added",
      data: {
        id: `sec_${Date.now()}`,
        fullName,
        rank,
        shift,
        status: "on-duty"
      }
    });
  } catch (error) {
    next(error);
  }
});

staffRouter.patch("/:staffId/shift", requireAuth, requireRole("admin"), (req, res, next) => {
  try {
    const { staffId } = req.params;
    const { shift } = req.body as Record<string, string>;

    if (!shift) {
      throw new HttpError(400, "Shift is required");
    }

    res.json({
      success: true,
      message: "Security duty schedule updated",
      data: {
        staffId,
        shift
      }
    });
  } catch (error) {
    next(error);
  }
});