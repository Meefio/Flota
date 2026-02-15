import { requireAdmin } from "@/lib/auth-utils";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { AUDIT_ACTION_LABELS, AUDIT_ENTITY_TYPE_LABELS } from "@/lib/constants";
import { formatAuditDetails } from "@/lib/audit-details-formatter";

export default async function AuditLogsPage() {
  await requireAdmin();

  const logs = await db
    .select({
      log: auditLogs,
      userName: users.name,
    })
    .from(auditLogs)
    .innerJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Historia zmian</h1>

      {logs.length === 0 ? (
        <p className="text-muted-foreground">Brak zapisanych zmian</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Użytkownik</TableHead>
                <TableHead>Akcja</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead className="hidden md:table-cell">Szczegóły</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((entry) => (
                <TableRow key={entry.log.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(entry.log.createdAt, "dd.MM.yyyy HH:mm", {
                      locale: pl,
                    })}
                  </TableCell>
                  <TableCell>{entry.userName}</TableCell>
                  <TableCell>
                    {AUDIT_ACTION_LABELS[entry.log.action] ?? entry.log.action}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {AUDIT_ENTITY_TYPE_LABELS[entry.log.entityType] ??
                        entry.log.entityType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-md">
                    <span className="block wrap-break-word">
                      {formatAuditDetails(
                        entry.log.action,
                        entry.log.entityType,
                        entry.log.details as Record<string, unknown> | null
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
