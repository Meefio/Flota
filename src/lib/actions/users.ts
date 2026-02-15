"use server";

import { randomBytes } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import { userSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export async function createUser(formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = userSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const randomToken = randomBytes(32).toString("hex");
  const passwordHash = await hash(randomToken, 12);

  const [user] = await db
    .insert(users)
    .values({
      email: parsed.data.email,
      passwordHash,
      name: parsed.data.name,
      role: parsed.data.role,
      mustSetPassword: true,
    })
    .returning({ id: users.id });

  if (user) {
    await logAudit({
      userId: Number(session.user.id),
      action: "user.create",
      entityType: "user",
      entityId: user.id,
      details: { email: parsed.data.email, name: parsed.data.name, role: parsed.data.role },
    });
  }

  revalidatePath("/admin/uzytkownicy");
  return { success: true, userId: user!.id };
}

export async function updateUser(id: number, formData: FormData) {
  const session = await requireAdmin();

  const raw = Object.fromEntries(formData);
  const parsed = userSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await db
    .update(users)
    .set({
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));

  await logAudit({
    userId: Number(session.user.id),
    action: "user.update",
    entityType: "user",
    entityId: id,
    details: { email: parsed.data.email, name: parsed.data.name, role: parsed.data.role },
  });

  revalidatePath("/admin/uzytkownicy");
  revalidatePath(`/admin/uzytkownicy/${id}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}

export async function resetUserPassword(userId: number) {
  const session = await requireAdmin();

  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!target) {
    return { error: "Nie znaleziono użytkownika" };
  }

  const randomToken = randomBytes(32).toString("hex");
  const passwordHash = await hash(randomToken, 12);

  await db
    .update(users)
    .set({
      passwordHash,
      mustSetPassword: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await logAudit({
    userId: Number(session.user.id),
    action: "user.password_reset",
    entityType: "user",
    entityId: userId,
    details: {},
  });

  revalidatePath("/admin/uzytkownicy");
  revalidatePath(`/admin/uzytkownicy/${userId}`);
  return { success: true };
}

export async function setUserActive(id: number, isActive: boolean) {
  const session = await requireAdmin();

  const currentUserId = Number(session.user.id);
  if (id === currentUserId && !isActive) {
    return { error: "Nie możesz dezaktywować własnego konta" };
  }

  await db
    .update(users)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(users.id, id));

  await logAudit({
    userId: currentUserId,
    action: isActive ? "user.activate" : "user.deactivate",
    entityType: "user",
    entityId: id,
    details: { isActive },
  });

  revalidatePath("/admin/uzytkownicy");
  revalidatePath(`/admin/uzytkownicy/${id}`);
  revalidatePath("/admin/kierowcy");
  return { success: true };
}
