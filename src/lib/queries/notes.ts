import { db } from "@/db";
import { vehicleNotes, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getVehicleNotes(vehicleId: number) {
  return db
    .select({
      id: vehicleNotes.id,
      content: vehicleNotes.content,
      isDone: vehicleNotes.isDone,
      createdById: vehicleNotes.createdById,
      createdByName: users.name,
      createdAt: vehicleNotes.createdAt,
    })
    .from(vehicleNotes)
    .innerJoin(users, eq(vehicleNotes.createdById, users.id))
    .where(eq(vehicleNotes.vehicleId, vehicleId))
    .orderBy(desc(vehicleNotes.createdAt));
}
