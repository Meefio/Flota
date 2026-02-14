"use server";

import { db } from "@/db";
import { vehicleAssignments } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { assignmentSchema } from "@/lib/validators";
import { format } from "date-fns";

export async function assignVehicle(formData: FormData) {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = assignmentSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // End current assignment if exists
  await db
    .update(vehicleAssignments)
    .set({ assignedTo: format(new Date(), "yyyy-MM-dd") })
    .where(
      and(
        eq(vehicleAssignments.vehicleId, parsed.data.vehicleId),
        isNull(vehicleAssignments.assignedTo)
      )
    );

  // Create new assignment
  await db.insert(vehicleAssignments).values({
    vehicleId: parsed.data.vehicleId,
    userId: parsed.data.userId,
    assignedFrom: parsed.data.assignedFrom,
    notes: parsed.data.notes ?? null,
  });

  revalidatePath(`/admin/pojazdy/${parsed.data.vehicleId}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}

export async function unassignVehicle(vehicleId: number) {
  await requireAdmin();

  await db
    .update(vehicleAssignments)
    .set({ assignedTo: format(new Date(), "yyyy-MM-dd") })
    .where(
      and(
        eq(vehicleAssignments.vehicleId, vehicleId),
        isNull(vehicleAssignments.assignedTo)
      )
    );

  revalidatePath(`/admin/pojazdy/${vehicleId}`);
  return { success: true };
}
