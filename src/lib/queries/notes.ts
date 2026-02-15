import { db } from "@/db";
import { vehicleNotes, users, vehicles } from "@/db/schema";
import { eq, desc, or, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

const assignedUser = alias(users, "assignedUser");

export async function getVehicleNotes(vehicleId: number) {
  return db
    .select({
      id: vehicleNotes.id,
      content: vehicleNotes.content,
      isDone: vehicleNotes.isDone,
      assignedToId: vehicleNotes.assignedToId,
      isAdminOnly: vehicleNotes.isAdminOnly,
      createdById: vehicleNotes.createdById,
      createdByName: users.name,
      assignedToName: assignedUser.name,
      createdAt: vehicleNotes.createdAt,
    })
    .from(vehicleNotes)
    .innerJoin(users, eq(vehicleNotes.createdById, users.id))
    .leftJoin(assignedUser, eq(vehicleNotes.assignedToId, assignedUser.id))
    .where(eq(vehicleNotes.vehicleId, vehicleId))
    .orderBy(desc(vehicleNotes.createdAt));
}

export async function getVehicleNotesForDriver(
  vehicleId: number,
  driverId: number
) {
  return db
    .select({
      id: vehicleNotes.id,
      content: vehicleNotes.content,
      isDone: vehicleNotes.isDone,
      assignedToId: vehicleNotes.assignedToId,
      isAdminOnly: vehicleNotes.isAdminOnly,
      createdById: vehicleNotes.createdById,
      createdByName: users.name,
      assignedToName: assignedUser.name,
      createdAt: vehicleNotes.createdAt,
    })
    .from(vehicleNotes)
    .innerJoin(users, eq(vehicleNotes.createdById, users.id))
    .leftJoin(assignedUser, eq(vehicleNotes.assignedToId, assignedUser.id))
    .where(
      and(
        eq(vehicleNotes.vehicleId, vehicleId),
        or(
          eq(vehicleNotes.isAdminOnly, false),
          eq(vehicleNotes.assignedToId, driverId),
          eq(vehicleNotes.createdById, driverId)
        )
      )
    )
    .orderBy(desc(vehicleNotes.createdAt));
}

export async function getDriverAssignedTasks(driverId: number) {
  return db
    .select({
      id: vehicleNotes.id,
      content: vehicleNotes.content,
      isDone: vehicleNotes.isDone,
      vehicleId: vehicleNotes.vehicleId,
      registrationNumber: vehicles.registrationNumber,
      createdByName: users.name,
      createdAt: vehicleNotes.createdAt,
    })
    .from(vehicleNotes)
    .innerJoin(vehicles, eq(vehicleNotes.vehicleId, vehicles.id))
    .innerJoin(users, eq(vehicleNotes.createdById, users.id))
    .where(
      and(
        eq(vehicleNotes.assignedToId, driverId),
        eq(vehicleNotes.isDone, false)
      )
    )
    .orderBy(desc(vehicleNotes.createdAt));
}

export async function getAllDriverAssignedTasks(driverId: number) {
  return db
    .select({
      id: vehicleNotes.id,
      content: vehicleNotes.content,
      isDone: vehicleNotes.isDone,
      vehicleId: vehicleNotes.vehicleId,
      registrationNumber: vehicles.registrationNumber,
      createdByName: users.name,
      createdAt: vehicleNotes.createdAt,
    })
    .from(vehicleNotes)
    .innerJoin(vehicles, eq(vehicleNotes.vehicleId, vehicles.id))
    .innerJoin(users, eq(vehicleNotes.createdById, users.id))
    .where(eq(vehicleNotes.assignedToId, driverId))
    .orderBy(desc(vehicleNotes.createdAt));
}
