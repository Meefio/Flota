"use server";

import { db } from "@/db";
import { vehicleDeadlines, deadlineOperations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { deadlineOperationSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import type { DeadlineType } from "@/db/schema";

export async function recordOperation(formData: FormData) {
  const session = await requireAuth();

  const raw = Object.fromEntries(formData);
  const parsed = deadlineOperationSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { vehicleId, deadlineType, performedAt, newExpiryDate, notes } =
    parsed.data;

  // Insert operation record
  const [operation] = await db
    .insert(deadlineOperations)
    .values({
      vehicleId,
      deadlineType: deadlineType as DeadlineType,
      performedById: Number(session.user.id),
      performedAt,
      newExpiryDate,
      notes: notes ?? null,
    })
    .returning();

  // Upsert deadline
  const existing = await db
    .select()
    .from(vehicleDeadlines)
    .where(
      and(
        eq(vehicleDeadlines.vehicleId, vehicleId),
        eq(vehicleDeadlines.type, deadlineType as DeadlineType)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(vehicleDeadlines)
      .set({
        expiresAt: newExpiryDate,
        updatedAt: new Date(),
      })
      .where(eq(vehicleDeadlines.id, existing[0].id));
  } else {
    await db.insert(vehicleDeadlines).values({
      vehicleId,
      type: deadlineType as DeadlineType,
      expiresAt: newExpiryDate,
    });
  }

  await logAudit({
    userId: Number(session.user.id),
    action: "deadline.operation",
    entityType: "vehicle",
    entityId: vehicleId,
    details: { deadlineType, newExpiryDate },
  });

  revalidatePath(`/admin/pojazdy/${vehicleId}`);
  revalidatePath(`/kierowca/pojazdy/${vehicleId}`);
  revalidatePath("/admin");
  revalidatePath("/kierowca");
  return { success: true, operationId: operation.id };
}
