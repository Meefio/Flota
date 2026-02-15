"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const profileNameSchema = z.object({
  name: z
    .string()
    .min(1, "Imię i nazwisko jest wymagane")
    .max(255, "Maksymalnie 255 znaków"),
});

export async function updateOwnName(formData: FormData) {
  const session = await requireAuth();

  const raw = Object.fromEntries(formData);
  const parsed = profileNameSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const userId = Number(session.user.id);

  await db
    .update(users)
    .set({ name: parsed.data.name, updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin/profil");
  revalidatePath("/kierowca/profil");
  revalidatePath("/admin");
  revalidatePath("/kierowca");
  return { success: true };
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
    newPassword: z
      .string()
      .min(6, "Nowe hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string().min(1, "Potwierdź nowe hasło"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła muszą być identyczne",
    path: ["confirmPassword"],
  });

export async function updateOwnPassword(formData: FormData) {
  const session = await requireAuth();

  const raw = Object.fromEntries(formData);
  const parsed = changePasswordSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const userId = Number(session.user.id);

  const [user] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { error: { currentPassword: ["Nie znaleziono użytkownika"] } };
  }

  const isValid = await compare(
    parsed.data.currentPassword,
    user.passwordHash
  );
  if (!isValid) {
    return { error: { currentPassword: ["Nieprawidłowe obecne hasło"] } };
  }

  const passwordHash = await hash(parsed.data.newPassword, 12);

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  revalidatePath("/admin/profil");
  revalidatePath("/kierowca/profil");
  return { success: true };
}
