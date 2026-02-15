import { z } from "zod";

export const vehicleSchema = z.object({
  type: z.enum(["truck", "trailer", "bus", "other"], { message: "Wybierz typ pojazdu" }),
  vin: z
    .string()
    .max(17)
    .nullable()
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return null;
      const s = String(v).trim();
      return s === "" ? null : s.toUpperCase();
    }),
  registrationNumber: z
    .string()
    .min(1, "Numer rejestracyjny jest wymagany")
    .max(20),
  brand: z.string().min(1, "Marka jest wymagana").max(100),
  model: z.string().min(1, "Model jest wymagany").max(100),
  year: z.coerce.number().min(1990).max(2030).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

export const deadlineOperationSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  deadlineType: z
    .string()
    .min(1, "Wybierz typ operacji")
    .refine((v) => ["przeglad", "ubezpieczenie", "tachograf", "winda_udt"].includes(v), "Nieprawidłowy typ operacji"),
  performedAt: z.string().min(1, "Data wykonania jest wymagana"),
  newExpiryDate: z.string().min(1, "Nowa data ważności jest wymagana"),
  notes: z.string().max(1000).optional(),
});

export type DeadlineOperationFormValues = z.infer<typeof deadlineOperationSchema>;

export const driverSchema = z.object({
  email: z.string().email("Nieprawidłowy email"),
  name: z.string().min(1, "Imię i nazwisko jest wymagane").max(255),
  pesel: z.string().length(11, "PESEL musi mieć 11 cyfr").regex(/^\d{11}$/, "PESEL musi składać się z 11 cyfr").nullable().optional(),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków").optional(),
});

export type DriverFormValues = z.infer<typeof driverSchema>;

export const driverDocumentSchema = z.object({
  userId: z.coerce.number().positive(),
  type: z.enum(["a1", "imi", "ekuz", "upowaznienie_pojazd", "upowaznienie_naczepa"]),
  expiresAt: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const assignmentSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  userId: z.coerce.number().positive(),
  assignedFrom: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  notes: z.string().max(500).optional(),
});

export const vehicleServiceSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  type: z.enum(["wymiana_oleju", "naprawa", "opony", "hamulce", "elektryka", "inne"], {
    message: "Wybierz typ serwisu",
  }),
  description: z.string().min(1, "Opis jest wymagany").max(1000),
  performedAt: z.string().min(1, "Data wykonania jest wymagana"),
  cost: z.coerce.number().min(0, "Koszt nie może być ujemny").nullable().optional(),
  mileage: z.coerce.number().min(0).nullable().optional(),
  workshop: z.string().max(255).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type VehicleServiceFormValues = z.infer<typeof vehicleServiceSchema>;

export const userSchema = z.object({
  email: z.string().email("Nieprawidłowy email"),
  name: z.string().min(1, "Imię i nazwisko jest wymagane").max(255),
  role: z.enum(["admin", "driver"], { message: "Wybierz rolę" }),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków").optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
