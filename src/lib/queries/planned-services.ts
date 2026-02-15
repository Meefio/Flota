import { db } from "@/db";
import { plannedVehicleServices, vehicles } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function getPlannedServicesByVehicle(vehicleId: number) {
  return db
    .select({
      id: plannedVehicleServices.id,
      type: plannedVehicleServices.type,
      plannedDate: plannedVehicleServices.plannedDate,
      notes: plannedVehicleServices.notes,
      createdAt: plannedVehicleServices.createdAt,
    })
    .from(plannedVehicleServices)
    .where(eq(plannedVehicleServices.vehicleId, vehicleId))
    .orderBy(plannedVehicleServices.plannedDate);
}

/** All planned services for active vehicles (for calendar). */
export async function getAllPlannedServicesForCalendar() {
  return db
    .select({
      id: plannedVehicleServices.id,
      vehicleId: plannedVehicleServices.vehicleId,
      type: plannedVehicleServices.type,
      plannedDate: plannedVehicleServices.plannedDate,
      notes: plannedVehicleServices.notes,
      registrationNumber: vehicles.registrationNumber,
    })
    .from(plannedVehicleServices)
    .innerJoin(vehicles, eq(plannedVehicleServices.vehicleId, vehicles.id))
    .where(eq(vehicles.isActive, true))
    .orderBy(plannedVehicleServices.plannedDate);
}

/** All planned services with vehicle info (for the global services page). */
export async function getAllPlannedServices() {
  return db
    .select({
      id: plannedVehicleServices.id,
      vehicleId: plannedVehicleServices.vehicleId,
      type: plannedVehicleServices.type,
      plannedDate: plannedVehicleServices.plannedDate,
      notes: plannedVehicleServices.notes,
      registrationNumber: vehicles.registrationNumber,
      vehicleBrand: vehicles.brand,
      vehicleModel: vehicles.model,
      createdAt: plannedVehicleServices.createdAt,
    })
    .from(plannedVehicleServices)
    .innerJoin(vehicles, eq(plannedVehicleServices.vehicleId, vehicles.id))
    .where(eq(vehicles.isActive, true))
    .orderBy(plannedVehicleServices.plannedDate);
}

/** Planned services for a vehicle that are still in the future (optional helper). */
export async function getUpcomingPlannedServicesByVehicle(vehicleId: number) {
  const today = new Date().toISOString().slice(0, 10);
  return db
    .select({
      id: plannedVehicleServices.id,
      type: plannedVehicleServices.type,
      plannedDate: plannedVehicleServices.plannedDate,
      notes: plannedVehicleServices.notes,
      createdAt: plannedVehicleServices.createdAt,
    })
    .from(plannedVehicleServices)
    .where(
      and(
        eq(plannedVehicleServices.vehicleId, vehicleId),
        gte(plannedVehicleServices.plannedDate, today)
      )
    )
    .orderBy(plannedVehicleServices.plannedDate);
}
