"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { driverSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function createDriver(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = driverSchema.safeParse({
    ...raw,
    pesel: raw.pesel || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  if (!parsed.data.password) {
    return { error: { password: ["Hasło jest wymagane dla nowego kierowcy"] } };
  }

  const passwordHash = await hash(parsed.data.password, 12);

  const [driver] = await db
    .insert(users)
    .values({
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      pesel: parsed.data.pesel ?? null,
      role: "driver",
    })
    .returning();

  await logAudit({
    userId: Number(session.user.id),
    action: "driver.create",
    entityType: "driver",
    entityId: driver.id,
    details: { email: parsed.data.email, name: parsed.data.name },
  });

  revalidatePath("/admin/kierowcy");
  return { success: true, driverId: driver.id };
}

export async function updateDriver(id: number, formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = driverSchema.safeParse({
    ...raw,
    pesel: raw.pesel || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const updateData: Record<string, unknown> = {
    email: parsed.data.email,
    name: parsed.data.name,
    pesel: parsed.data.pesel ?? null,
    updatedAt: new Date(),
  };

  if (parsed.data.password) {
    updateData.passwordHash = await hash(parsed.data.password, 12);
  }

  await db.update(users).set(updateData).where(eq(users.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "driver.update",
    entityType: "driver",
    entityId: id,
    details: { email: parsed.data.email, name: parsed.data.name },
  });

  revalidatePath("/admin/kierowcy");
  revalidatePath(`/admin/kierowcy/${id}`);
  return { success: true };
}

export async function deactivateDriver(id: number) {
  const session = await requireAdmin();

  await db
    .update(users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(users.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "driver.deactivate",
    entityType: "driver",
    entityId: id,
  });

  revalidatePath("/admin/kierowcy");
  return { success: true };
}
