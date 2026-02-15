"use server";

import { db } from "@/db";
import { driverDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { logAudit } from "@/lib/audit";
import type { DriverDocumentType } from "@/db/schema";

export async function updateDriverDocument(
  userId: number,
  type: DriverDocumentType,
  data: { expiresAt?: string | null; isActive?: boolean }
) {
  const session = await requireAdmin();

  const existing = await db
    .select()
    .from(driverDocuments)
    .where(
      and(
        eq(driverDocuments.userId, userId),
        eq(driverDocuments.type, type)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(driverDocuments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(driverDocuments.id, existing[0].id));
  } else {
    await db.insert(driverDocuments).values({
      userId,
      type,
      expiresAt: data.expiresAt ?? null,
      isActive: data.isActive ?? false,
    });
  }

  await logAudit({
    userId: Number(session.user.id),
    action: "driver_document.update",
    entityType: "driver_document",
    entityId: userId,
    details: { type, expiresAt: data.expiresAt ?? null, isActive: data.isActive },
  });

  revalidatePath(`/admin/kierowcy/${userId}`);
  revalidatePath(`/kierowca/dokumenty`);
  return { success: true };
}

export async function toggleAuthorization(
  userId: number,
  type: DriverDocumentType,
  isActive: boolean
) {
  return updateDriverDocument(userId, type, { isActive });
}
