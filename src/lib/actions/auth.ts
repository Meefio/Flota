"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

/**
 * Sprawdza email przy logowaniu. Zwraca ok + mustSetPassword tylko dla istniejącego,
 * aktywnego użytkownika. Nie ujawnia, czy konto nie istnieje czy jest nieaktywne.
 */
export async function checkLoginEmail(email: string) {
  const normalized = String(email).trim().toLowerCase();
  if (!normalized) return { ok: false as const };

  const [user] = await db
    .select({
      mustSetPassword: users.mustSetPassword,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (!user || !user.isActive) return { ok: false as const };

  return {
    ok: true as const,
    mustSetPassword: user.mustSetPassword,
  };
}

const setPasswordSchema = {
  password: (v: string) =>
    v.length >= 6 ? null : "Hasło musi mieć co najmniej 6 znaków",
  confirm: (v: string, p: string) => (v === p ? null : "Hasła muszą być identyczne"),
};

/**
 * Ustawia nowe hasło dla użytkownika z mustSetPassword i zwraca sukces.
 * Klient po sukcesie wywołuje signIn("credentials", { email, password }).
 */
export async function setPasswordAndLogin(
  email: string,
  password: string,
  confirmPassword: string
) {
  const normalized = String(email).trim().toLowerCase();
  const errPassword = setPasswordSchema.password(password);
  const errConfirm = setPasswordSchema.confirm(confirmPassword, password);

  if (errPassword)
    return { error: errPassword };
  if (errConfirm)
    return { error: errConfirm };

  const [user] = await db
    .select({ id: users.id, mustSetPassword: users.mustSetPassword })
    .from(users)
    .where(eq(users.email, normalized))
    .limit(1);

  if (!user || !user.mustSetPassword) {
    return { error: "Nie można ustawić hasła. Skontaktuj się z administratorem." };
  }

  const passwordHash = await hash(password, 12);

  await db
    .update(users)
    .set({
      passwordHash,
      mustSetPassword: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true as const };
}
