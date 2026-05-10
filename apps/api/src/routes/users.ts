import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";
import { logAudit } from "../lib/audit.js";
import { HttpError } from "../lib/http-errors.js";

export const usersRouter = Router();

usersRouter.use(requireAuth, requireRole("admin"));

usersRouter.get("/", async (req, res, next) => {
  try {
    const { q = "", status = "" } = req.query as Record<string, string>;
    const search = q.trim();

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { fullName: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } }
                ]
              }
            : {},
          status
            ? {
                status
              }
            : {}
        ]
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        status: true,
        role: {
          select: { name: true }
        },
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      data: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
        role: user.role.name.toLowerCase().replace(/_/g, "-")
      }))
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.patch("/:userId/status", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body as Record<string, string>;

    if (!status) {
      throw new HttpError(400, "Status is required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true
      }
    });

    await logAudit({
      actorId: req.user?.id,
      action: "update",
      entityType: "User",
      entityId: userId,
      metadata: {
        status
      }
    });

    res.json({
      success: true,
      message: "User status updated",
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});