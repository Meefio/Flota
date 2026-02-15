"use server";

import { db } from "@/db";
import { vehicleAssignments } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { assignmentSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { format } from "date-fns";

export async function assignVehicle(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = assignmentSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const [assignment] = await db
    .insert(vehicleAssignments)
    .values({
      vehicleId: parsed.data.vehicleId,
      userId: parsed.data.userId,
      assignedFrom: parsed.data.assignedFrom,
      notes: parsed.data.notes ?? null,
    })
    .returning({ id: vehicleAssignments.id });

  if (assignment) {
    await logAudit({
      userId: Number(session.user.id),
      action: "assignment.create",
      entityType: "assignment",
      entityId: assignment.id,
      details: {
        vehicleId: parsed.data.vehicleId,
        userId: parsed.data.userId,
      },
    });
  }

  revalidatePath(`/admin/pojazdy/${parsed.data.vehicleId}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}

export async function unassignVehicle(vehicleId: number) {
  const session = await requireAdmin();

  await db
    .update(vehicleAssignments)
    .set({ assignedTo: format(new Date(), "yyyy-MM-dd") })
    .where(
      and(
        eq(vehicleAssignments.vehicleId, vehicleId),
        isNull(vehicleAssignments.assignedTo)
      )
    );

  await logAudit({
    userId: Number(session.user.id),
    action: "assignment.end",
    entityType: "vehicle_assignment",
    entityId: vehicleId,
    details: { vehicleId },
  });

  revalidatePath(`/admin/pojazdy/${vehicleId}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}

export async function unassignByAssignmentId(assignmentId: number) {
  const session = await requireAdmin();

  const [assignment] = await db
    .select({ vehicleId: vehicleAssignments.vehicleId })
    .from(vehicleAssignments)
    .where(eq(vehicleAssignments.id, assignmentId))
    .limit(1);

  if (!assignment) {
    return { error: "Przypisanie nie istnieje" };
  }

  await db
    .update(vehicleAssignments)
    .set({ assignedTo: format(new Date(), "yyyy-MM-dd") })
    .where(eq(vehicleAssignments.id, assignmentId));

  await logAudit({
    userId: Number(session.user.id),
    action: "assignment.end",
    entityType: "assignment",
    entityId: assignmentId,
    details: { vehicleId: assignment.vehicleId },
  });

  revalidatePath(`/admin/pojazdy/${assignment.vehicleId}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}
