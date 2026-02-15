"use server";

import { db } from "@/db";
import { vehicleServices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { vehicleServiceSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function createService(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = vehicleServiceSchema.safeParse({
    ...raw,
    cost: raw.cost ? Number(raw.cost) : null,
    mileage: raw.mileage ? Number(raw.mileage) : null,
    workshop: raw.workshop || null,
    notes: raw.notes || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const [service] = await db
    .insert(vehicleServices)
    .values({
      vehicleId: parsed.data.vehicleId,
      type: parsed.data.type,
      description: parsed.data.description,
      performedAt: parsed.data.performedAt,
      cost: parsed.data.cost?.toString() ?? null,
      mileage: parsed.data.mileage ?? null,
      workshop: parsed.data.workshop ?? null,
      notes: parsed.data.notes ?? null,
      createdById: Number(session.user.id),
    })
    .returning();

  await logAudit({
    userId: Number(session.user.id),
    action: "service.create",
    entityType: "vehicle_service",
    entityId: service.id,
    details: parsed.data,
  });

  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${parsed.data.vehicleId}`);
  return { success: true, serviceId: service.id };
}

export async function updateService(id: number, formData: FormData) {
  const session = await requireAdmin();

  const [existing] = await db
    .select({
      vehicleId: vehicleServices.vehicleId,
      type: vehicleServices.type,
      description: vehicleServices.description,
      performedAt: vehicleServices.performedAt,
      cost: vehicleServices.cost,
      mileage: vehicleServices.mileage,
      workshop: vehicleServices.workshop,
      notes: vehicleServices.notes,
    })
    .from(vehicleServices)
    .where(eq(vehicleServices.id, id))
    .limit(1);

  if (!existing) return { error: "Nie znaleziono serwisu" };

  const raw = Object.fromEntries(formData);
  const parsed = vehicleServiceSchema.safeParse({
    ...raw,
    vehicleId: existing.vehicleId,
    cost: raw.cost ? Number(raw.cost) : null,
    mileage: raw.mileage ? Number(raw.mileage) : null,
    workshop: raw.workshop || null,
    notes: raw.notes || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(vehicleServices)
    .set({
      type: parsed.data.type,
      description: parsed.data.description,
      performedAt: parsed.data.performedAt,
      cost: parsed.data.cost?.toString() ?? null,
      mileage: parsed.data.mileage ?? null,
      workshop: parsed.data.workshop ?? null,
      notes: parsed.data.notes ?? null,
    })
    .where(eq(vehicleServices.id, id));

  const previous = {
    type: existing.type,
    description: existing.description,
    performedAt: existing.performedAt,
    cost: existing.cost ? Number(existing.cost) : null,
    mileage: existing.mileage,
    workshop: existing.workshop,
    notes: existing.notes,
  };

  await logAudit({
    userId: Number(session.user.id),
    action: "service.update",
    entityType: "vehicle_service",
    entityId: id,
    details: { previous, current: parsed.data },
  });

  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${existing.vehicleId}`);
  return { success: true };
}

export async function deleteService(id: number) {
  const session = await requireAdmin();

  const [service] = await db
    .select({ vehicleId: vehicleServices.vehicleId })
    .from(vehicleServices)
    .where(eq(vehicleServices.id, id))
    .limit(1);

  if (!service) return { error: "Nie znaleziono serwisu" };

  await db.delete(vehicleServices).where(eq(vehicleServices.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "service.delete",
    entityType: "vehicle_service",
    entityId: id,
  });

  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${service.vehicleId}`);
  return { success: true };
}
