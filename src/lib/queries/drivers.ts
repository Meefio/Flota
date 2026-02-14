import { db } from "@/db";
import { users, driverDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getDrivers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.role, "driver"), eq(users.isActive, true)))
    .orderBy(users.name);
}

export async function getDriverById(id: number) {
  const [driver] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isActive: users.isActive,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(and(eq(users.id, id), eq(users.role, "driver")))
    .limit(1);

  return driver ?? null;
}

export async function getDriverDocuments(userId: number) {
  return db
    .select()
    .from(driverDocuments)
    .where(eq(driverDocuments.userId, userId))
    .orderBy(driverDocuments.type);
}

export async function getDriverWithDocuments(id: number) {
  const driver = await getDriverById(id);
  if (!driver) return null;

  const documents = await getDriverDocuments(id);
  return { ...driver, documents };
}
