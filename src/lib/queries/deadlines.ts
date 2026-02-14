import { db } from "@/db";
import {
  vehicleDeadlines,
  deadlineOperations,
  vehicles,
  users,
  fileAttachments,
} from "@/db/schema";
import { eq, and, lte, desc } from "drizzle-orm";
import { addDays, format } from "date-fns";

export async function getExpiringDeadlines(daysAhead: number = 7) {
  const cutoff = format(addDays(new Date(), daysAhead), "yyyy-MM-dd");

  const result = await db
    .select({
      deadline: vehicleDeadlines,
      vehicle: vehicles,
    })
    .from(vehicleDeadlines)
    .innerJoin(vehicles, eq(vehicleDeadlines.vehicleId, vehicles.id))
    .where(
      and(lte(vehicleDeadlines.expiresAt, cutoff), eq(vehicles.isActive, true))
    )
    .orderBy(vehicleDeadlines.expiresAt);

  return result;
}

export async function getDeadlineHistory(vehicleId: number) {
  const operations = await db
    .select({
      operation: deadlineOperations,
      performedBy: {
        name: users.name,
      },
    })
    .from(deadlineOperations)
    .innerJoin(users, eq(deadlineOperations.performedById, users.id))
    .where(eq(deadlineOperations.vehicleId, vehicleId))
    .orderBy(desc(deadlineOperations.createdAt));

  // Get file attachments for each operation
  const operationIds = operations.map((o) => o.operation.id);
  const files =
    operationIds.length > 0
      ? await db
          .select()
          .from(fileAttachments)
          .where(
            // Simple approach for small scale
            eq(fileAttachments.deadlineOperationId, operationIds[0])
          )
      : [];

  // Get all files for all operations
  const allFiles = await db.select().from(fileAttachments);

  return operations.map((o) => ({
    ...o.operation,
    performedByName: o.performedBy.name,
    files: allFiles.filter(
      (f) => f.deadlineOperationId === o.operation.id
    ),
  }));
}
