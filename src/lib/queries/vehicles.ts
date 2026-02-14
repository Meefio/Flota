import { db } from "@/db";
import { vehicles, vehicleDeadlines, vehicleAssignments, users } from "@/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export async function getVehicles(type?: "truck" | "trailer") {
  const conditions = [eq(vehicles.isActive, true)];
  if (type) conditions.push(eq(vehicles.type, type));

  const result = await db
    .select()
    .from(vehicles)
    .where(and(...conditions))
    .orderBy(vehicles.registrationNumber);

  return result;
}

export async function getVehicleById(id: number) {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1);

  return vehicle ?? null;
}

export async function getVehicleWithDetails(id: number) {
  const vehicle = await getVehicleById(id);
  if (!vehicle) return null;

  const deadlines = await db
    .select()
    .from(vehicleDeadlines)
    .where(eq(vehicleDeadlines.vehicleId, id));

  const currentAssignment = await db
    .select({
      id: vehicleAssignments.id,
      userId: vehicleAssignments.userId,
      assignedFrom: vehicleAssignments.assignedFrom,
      notes: vehicleAssignments.notes,
      driverName: users.name,
    })
    .from(vehicleAssignments)
    .innerJoin(users, eq(vehicleAssignments.userId, users.id))
    .where(
      and(
        eq(vehicleAssignments.vehicleId, id),
        isNull(vehicleAssignments.assignedTo)
      )
    )
    .limit(1);

  return {
    ...vehicle,
    deadlines,
    currentAssignment: currentAssignment[0] ?? null,
  };
}

export async function getVehiclesWithDeadlines() {
  const allVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.isActive, true))
    .orderBy(vehicles.registrationNumber);

  const allDeadlines = await db.select().from(vehicleDeadlines);

  return allVehicles.map((v) => ({
    ...v,
    deadlines: allDeadlines.filter((d) => d.vehicleId === v.id),
  }));
}
