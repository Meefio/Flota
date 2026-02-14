import { db } from "@/db";
import {
  vehicles,
  vehicleDeadlines,
  users,
  vehicleAssignments,
  driverDocuments,
} from "@/db/schema";
import { eq, and, isNull, lte, count } from "drizzle-orm";
import { addDays, format } from "date-fns";
import { getDeadlineStatus } from "@/lib/deadline-utils";

export async function getAdminDashboardStats() {
  const [trucksCount] = await db
    .select({ count: count() })
    .from(vehicles)
    .where(and(eq(vehicles.type, "truck"), eq(vehicles.isActive, true)));

  const [trailersCount] = await db
    .select({ count: count() })
    .from(vehicles)
    .where(and(eq(vehicles.type, "trailer"), eq(vehicles.isActive, true)));

  const [driversCount] = await db
    .select({ count: count() })
    .from(users)
    .where(and(eq(users.role, "driver"), eq(users.isActive, true)));

  const cutoff7 = format(addDays(new Date(), 7), "yyyy-MM-dd");
  const urgentDeadlines = await db
    .select({
      deadline: vehicleDeadlines,
      vehicleRegistration: vehicles.registrationNumber,
      vehicleType: vehicles.type,
    })
    .from(vehicleDeadlines)
    .innerJoin(vehicles, eq(vehicleDeadlines.vehicleId, vehicles.id))
    .where(and(lte(vehicleDeadlines.expiresAt, cutoff7), eq(vehicles.isActive, true)))
    .orderBy(vehicleDeadlines.expiresAt);

  return {
    trucks: trucksCount.count,
    trailers: trailersCount.count,
    drivers: driversCount.count,
    urgentDeadlines: urgentDeadlines.map((d) => ({
      ...d.deadline,
      vehicleRegistration: d.vehicleRegistration,
      vehicleType: d.vehicleType,
      status: getDeadlineStatus(d.deadline.expiresAt),
    })),
  };
}

export async function getDriverDashboard(userId: number) {
  const myVehicles = await db
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

  // Get deadlines for assigned vehicles
  const vehicleIds = myVehicles.map((v) => v.vehicleId);
  const deadlines =
    vehicleIds.length > 0
      ? await db.select().from(vehicleDeadlines)
      : [];

  const myDeadlines = deadlines.filter((d) =>
    vehicleIds.includes(d.vehicleId)
  );

  const myDocuments = await db
    .select()
    .from(driverDocuments)
    .where(eq(driverDocuments.userId, userId));

  return {
    vehicles: myVehicles.map((v) => ({
      ...v,
      deadlines: myDeadlines.filter((d) => d.vehicleId === v.vehicleId),
    })),
    documents: myDocuments,
  };
}
