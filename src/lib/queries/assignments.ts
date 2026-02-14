import { db } from "@/db";
import { vehicleAssignments, users, vehicles } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function getCurrentAssignment(vehicleId: number) {
  const [assignment] = await db
    .select({
      id: vehicleAssignments.id,
      vehicleId: vehicleAssignments.vehicleId,
      userId: vehicleAssignments.userId,
      assignedFrom: vehicleAssignments.assignedFrom,
      notes: vehicleAssignments.notes,
      driverName: users.name,
    })
    .from(vehicleAssignments)
    .innerJoin(users, eq(vehicleAssignments.userId, users.id))
    .where(
      and(
        eq(vehicleAssignments.vehicleId, vehicleId),
        isNull(vehicleAssignments.assignedTo)
      )
    )
    .limit(1);

  return assignment ?? null;
}

export async function getVehicleAssignmentHistory(vehicleId: number) {
  return db
    .select({
      id: vehicleAssignments.id,
      assignedFrom: vehicleAssignments.assignedFrom,
      assignedTo: vehicleAssignments.assignedTo,
      notes: vehicleAssignments.notes,
      driverName: users.name,
    })
    .from(vehicleAssignments)
    .innerJoin(users, eq(vehicleAssignments.userId, users.id))
    .where(eq(vehicleAssignments.vehicleId, vehicleId))
    .orderBy(desc(vehicleAssignments.createdAt));
}

export async function getDriverAssignments(userId: number) {
  return db
    .select({
      id: vehicleAssignments.id,
      assignedFrom: vehicleAssignments.assignedFrom,
      assignedTo: vehicleAssignments.assignedTo,
      notes: vehicleAssignments.notes,
      vehicleRegistration: vehicles.registrationNumber,
      vehicleBrand: vehicles.brand,
      vehicleModel: vehicles.model,
      vehicleId: vehicles.id,
    })
    .from(vehicleAssignments)
    .innerJoin(vehicles, eq(vehicleAssignments.vehicleId, vehicles.id))
    .where(eq(vehicleAssignments.userId, userId))
    .orderBy(desc(vehicleAssignments.createdAt));
}

export async function getDriverCurrentVehicles(userId: number) {
  return db
    .select({
      assignmentId: vehicleAssignments.id,
      vehicleId: vehicles.id,
      registrationNumber: vehicles.registrationNumber,
      brand: vehicles.brand,
      model: vehicles.model,
      type: vehicles.type,
    })
    .from(vehicleAssignments)
    .innerJoin(vehicles, eq(vehicleAssignments.vehicleId, vehicles.id))
    .where(
      and(
        eq(vehicleAssignments.userId, userId),
        isNull(vehicleAssignments.assignedTo)
      )
    );
}
