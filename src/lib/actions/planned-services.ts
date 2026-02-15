"use server";

import { db } from "@/db";
import { plannedVehicleServices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { plannedServiceSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function createPlannedService(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = plannedServiceSchema.safeParse({
    ...raw,
    notes: raw.notes && String(raw.notes).trim() ? raw.notes : null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const [planned] = await db
    .insert(plannedVehicleServices)
    .values({
      vehicleId: parsed.data.vehicleId,
      type: parsed.data.type,
      plannedDate: parsed.data.plannedDate,
      notes: parsed.data.notes ?? null,
      createdById: Number(session.user.id),
    })
    .returning();

  await logAudit({
    userId: Number(session.user.id),
    action: "planned_service.create",
    entityType: "planned_vehicle_service",
    entityId: planned.id,
    details: parsed.data,
  });

  revalidatePath("/admin/kalendarz");
  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${parsed.data.vehicleId}`);
  return { success: true, plannedServiceId: planned.id };
}

export async function updatePlannedService(id: number, formData: FormData) {
  const session = await requireAdmin();

  const [existing] = await db
    .select({
      vehicleId: plannedVehicleServices.vehicleId,
      type: plannedVehicleServices.type,
      plannedDate: plannedVehicleServices.plannedDate,
      notes: plannedVehicleServices.notes,
    })
    .from(plannedVehicleServices)
    .where(eq(plannedVehicleServices.id, id))
    .limit(1);

  if (!existing) return { error: "Nie znaleziono zaplanowanego serwisu" };

  const raw = Object.fromEntries(formData);
  const parsed = plannedServiceSchema.safeParse({
    ...raw,
    vehicleId: existing.vehicleId,
    notes: raw.notes && String(raw.notes).trim() ? raw.notes : null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(plannedVehicleServices)
    .set({
      type: parsed.data.type,
      plannedDate: parsed.data.plannedDate,
      notes: parsed.data.notes ?? null,
    })
    .where(eq(plannedVehicleServices.id, id));

  const previous = {
    type: existing.type,
    plannedDate: existing.plannedDate,
    notes: existing.notes,
  };

  await logAudit({
    userId: Number(session.user.id),
    action: "planned_service.update",
    entityType: "planned_vehicle_service",
    entityId: id,
    details: { previous, current: parsed.data },
  });

  revalidatePath("/admin/kalendarz");
  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${existing.vehicleId}`);
  return { success: true };
}

export async function deletePlannedService(id: number) {
  const session = await requireAdmin();

  const [planned] = await db
    .select({ vehicleId: plannedVehicleServices.vehicleId })
    .from(plannedVehicleServices)
    .where(eq(plannedVehicleServices.id, id))
    .limit(1);

  if (!planned) return { error: "Nie znaleziono zaplanowanego serwisu" };

  await db.delete(plannedVehicleServices).where(eq(plannedVehicleServices.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "planned_service.delete",
    entityType: "planned_vehicle_service",
    entityId: id,
  });

  revalidatePath("/admin/kalendarz");
  revalidatePath("/admin/serwisy");
  revalidatePath(`/admin/pojazdy/${planned.vehicleId}`);
  return { success: true };
}
