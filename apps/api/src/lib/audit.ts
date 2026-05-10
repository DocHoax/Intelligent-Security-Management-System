import { prisma } from "./prisma.js";

type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "assign"
  | "approve"
  | "check_in"
  | "check_out";

export async function logAudit(input: {
  actorId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action.toUpperCase().replace(/-/g, "_") as never,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
        ipAddress: input.ipAddress
      }
    });
  } catch {
    // Audit logging should never break the primary request flow.
  }
}