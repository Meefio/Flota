import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { hash } from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123", 12);
  const [admin] = await db
    .insert(schema.users)
    .values({
      email: "admin@flota.pl",
      passwordHash: adminPassword,
      name: "Administrator",
      role: "admin",
    })
    .returning();
  console.log("Created admin:", admin.email);

  // Create driver user
  const driverPassword = await hash("kierowca123", 12);
  const [driver] = await db
    .insert(schema.users)
    .values({
      email: "jan.kowalski@flota.pl",
      passwordHash: driverPassword,
      name: "Jan Kowalski",
      role: "driver",
    })
    .returning();
  console.log("Created driver:", driver.email);

  // Create sample vehicles
  const [truck1] = await db
    .insert(schema.vehicles)
    .values({
      type: "truck",
      registrationNumber: "WGM 12345",
      brand: "Volvo",
      model: "FH 500",
      year: 2021,
    })
    .returning();

  const [truck2] = await db
    .insert(schema.vehicles)
    .values({
      type: "truck",
      registrationNumber: "WGM 67890",
      brand: "Scania",
      model: "R 450",
      year: 2022,
    })
    .returning();

  const [trailer1] = await db
    .insert(schema.vehicles)
    .values({
      type: "trailer",
      registrationNumber: "WGM 11111",
      brand: "Krone",
      model: "Cool Liner",
      year: 2020,
    })
    .returning();

  console.log("Created vehicles:", truck1.registrationNumber, truck2.registrationNumber, trailer1.registrationNumber);

  // Create deadlines for vehicles
  const today = new Date();
  const deadlines = [
    // Truck 1 - some OK, some expiring soon
    { vehicleId: truck1.id, type: "przeglad" as const, expiresAt: addDays(today, 45).toISOString().split("T")[0] },
    { vehicleId: truck1.id, type: "ubezpieczenie" as const, expiresAt: addDays(today, 5).toISOString().split("T")[0] },
    { vehicleId: truck1.id, type: "tachograf" as const, expiresAt: addDays(today, 120).toISOString().split("T")[0] },
    // Truck 2 - expired deadline
    { vehicleId: truck2.id, type: "przeglad" as const, expiresAt: addDays(today, -3).toISOString().split("T")[0] },
    { vehicleId: truck2.id, type: "ubezpieczenie" as const, expiresAt: addDays(today, 200).toISOString().split("T")[0] },
    // Trailer 1
    { vehicleId: trailer1.id, type: "przeglad" as const, expiresAt: addDays(today, 15).toISOString().split("T")[0] },
    { vehicleId: trailer1.id, type: "winda_udt" as const, expiresAt: addDays(today, 60).toISOString().split("T")[0] },
  ];

  await db.insert(schema.vehicleDeadlines).values(deadlines);
  console.log("Created deadlines");

  // Assign driver to truck1
  await db.insert(schema.vehicleAssignments).values({
    vehicleId: truck1.id,
    userId: driver.id,
    assignedFrom: today.toISOString().split("T")[0],
  });
  console.log("Assigned driver to vehicle");

  // Create driver documents
  await db.insert(schema.driverDocuments).values([
    { userId: driver.id, type: "a1" as const, expiresAt: addDays(today, 90).toISOString().split("T")[0] },
    { userId: driver.id, type: "imi" as const, expiresAt: addDays(today, 180).toISOString().split("T")[0] },
    { userId: driver.id, type: "ekuz" as const, expiresAt: addDays(today, 30).toISOString().split("T")[0] },
    { userId: driver.id, type: "upowaznienie_pojazd" as const, isActive: true },
    { userId: driver.id, type: "upowaznienie_naczepa" as const, isActive: false },
  ]);
  console.log("Created driver documents");

  console.log("Seed complete!");
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

seed().catch(console.error);
