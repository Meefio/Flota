import { db } from "@/db";
import { auditLogs } from "@/db/schema";

interface LogAuditParams {
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  details?: Record<string, unknown>;
}

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  details,
}: LogAuditParams) {
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      entityType,
      entityId,
      details: details ?? null,
    });
  } catch (error) {
    // Don't let audit logging break the main flow
    console.error("Audit log error:", error);
  }
}
