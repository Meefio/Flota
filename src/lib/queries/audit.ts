import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export type RecentAuditEntry = {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  createdAt: Date;
  userName: string;
  userRole: "admin" | "driver";
};

/**
 * Ostatnie wpisy z logów audytu (dla dropdownu powiadomień admina).
 * Pokazuje kto (w tym kierowcy) co zmienił w aplikacji.
 */
export async function getRecentAuditLogsForAdmin(
  limit: number = 15
): Promise<RecentAuditEntry[]> {
  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      entityType: auditLogs.entityType,
      entityId: auditLogs.entityId,
      createdAt: auditLogs.createdAt,
      userName: users.name,
      userRole: users.role,
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  return rows as RecentAuditEntry[];
}
