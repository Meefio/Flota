"use server";

import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { vehicleSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function createVehicle(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = vehicleSchema.safeParse({
    ...raw,
    year: raw.year ? Number(raw.year) : null,
    vin: raw.vin || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const [vehicle] = await db
    .insert(vehicles)
    .values({
      type: parsed.data.type,
      registrationNumber: parsed.data.registrationNumber,
      vin: parsed.data.vin ?? null,
      brand: parsed.data.brand,
      model: parsed.data.model,
      year: parsed.data.year ?? null,
      notes: parsed.data.notes ?? null,
    })
    .returning();

  await logAudit({
    userId: Number(session.user.id),
    action: "vehicle.create",
    entityType: "vehicle",
    entityId: vehicle.id,
    details: parsed.data,
  });

  revalidatePath("/admin/pojazdy");
  return { success: true, vehicleId: vehicle.id };
}

export async function updateVehicle(id: number, formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = vehicleSchema.safeParse({
    ...raw,
    year: raw.year ? Number(raw.year) : null,
    vin: raw.vin || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(vehicles)
    .set({
      type: parsed.data.type,
      registrationNumber: parsed.data.registrationNumber,
      vin: parsed.data.vin ?? null,
      brand: parsed.data.brand,
      model: parsed.data.model,
      year: parsed.data.year ?? null,
      notes: parsed.data.notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(vehicles.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "vehicle.update",
    entityType: "vehicle",
    entityId: id,
    details: parsed.data,
  });

  revalidatePath("/admin/pojazdy");
  revalidatePath(`/admin/pojazdy/${id}`);
  return { success: true };
}

export async function deleteVehicle(id: number) {
  const session = await requireAdmin();

  await db
    .update(vehicles)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(vehicles.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "vehicle.delete",
    entityType: "vehicle",
    entityId: id,
  });

  revalidatePath("/admin/pojazdy");
  return { success: true };
}
