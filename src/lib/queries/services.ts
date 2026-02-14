import { db } from "@/db";
import { vehicleServices, vehicles, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getVehicleServices(vehicleId: number) {
  return db
    .select({
      id: vehicleServices.id,
      type: vehicleServices.type,
      description: vehicleServices.description,
      performedAt: vehicleServices.performedAt,
      cost: vehicleServices.cost,
      mileage: vehicleServices.mileage,
      workshop: vehicleServices.workshop,
      notes: vehicleServices.notes,
      createdAt: vehicleServices.createdAt,
    })
    .from(vehicleServices)
    .where(eq(vehicleServices.vehicleId, vehicleId))
    .orderBy(desc(vehicleServices.performedAt));
}

export async function getAllServices() {
  return db
    .select({
      id: vehicleServices.id,
      type: vehicleServices.type,
      description: vehicleServices.description,
      performedAt: vehicleServices.performedAt,
      cost: vehicleServices.cost,
      mileage: vehicleServices.mileage,
      workshop: vehicleServices.workshop,
      notes: vehicleServices.notes,
      vehicleId: vehicleServices.vehicleId,
      registrationNumber: vehicles.registrationNumber,
      vehicleBrand: vehicles.brand,
      vehicleModel: vehicles.model,
      createdByName: users.name,
      createdAt: vehicleServices.createdAt,
    })
    .from(vehicleServices)
    .innerJoin(vehicles, eq(vehicleServices.vehicleId, vehicles.id))
    .innerJoin(users, eq(vehicleServices.createdById, users.id))
    .orderBy(desc(vehicleServices.performedAt));
}
