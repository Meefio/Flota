import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== USERS ====================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().$type<"admin" | "driver">(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  deadlineOperations: many(deadlineOperations),
  driverDocuments: many(driverDocuments),
  vehicleAssignments: many(vehicleAssignments),
  fileAttachments: many(fileAttachments),
  auditLogs: many(auditLogs),
}));

// ==================== VEHICLES ====================
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull().$type<"truck" | "trailer">(),
  registrationNumber: varchar("registration_number", { length: 20 }).notNull().unique(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const vehiclesRelations = relations(vehicles, ({ many }) => ({
  deadlines: many(vehicleDeadlines),
  deadlineOperations: many(deadlineOperations),
  assignments: many(vehicleAssignments),
}));

// ==================== VEHICLE DEADLINES ====================
export type DeadlineType = "przeglad" | "ubezpieczenie" | "tachograf" | "winda_udt";

export const vehicleDeadlines = pgTable(
  "vehicle_deadlines",
  {
    id: serial("id").primaryKey(),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 30 }).notNull().$type<DeadlineType>(),
    expiresAt: date("expires_at").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("vehicle_deadline_unique").on(table.vehicleId, table.type)]
);

export const vehicleDeadlinesRelations = relations(vehicleDeadlines, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleDeadlines.vehicleId],
    references: [vehicles.id],
  }),
}));

// ==================== DEADLINE OPERATIONS ====================
export const deadlineOperations = pgTable("deadline_operations", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  deadlineType: varchar("deadline_type", { length: 30 }).notNull().$type<DeadlineType>(),
  performedById: integer("performed_by_id")
    .notNull()
    .references(() => users.id),
  performedAt: date("performed_at").notNull(),
  newExpiryDate: date("new_expiry_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deadlineOperationsRelations = relations(deadlineOperations, ({ one, many }) => ({
  vehicle: one(vehicles, {
    fields: [deadlineOperations.vehicleId],
    references: [vehicles.id],
  }),
  performedBy: one(users, {
    fields: [deadlineOperations.performedById],
    references: [users.id],
  }),
  fileAttachments: many(fileAttachments),
}));

// ==================== DRIVER DOCUMENTS ====================
export type DriverDocumentType =
  | "a1"
  | "imi"
  | "ekuz"
  | "upowaznienie_pojazd"
  | "upowaznienie_naczepa";

export const driverDocuments = pgTable(
  "driver_documents",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 30 }).notNull().$type<DriverDocumentType>(),
    expiresAt: date("expires_at"),
    isActive: boolean("is_active").notNull().default(false),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("driver_document_unique").on(table.userId, table.type)]
);

export const driverDocumentsRelations = relations(driverDocuments, ({ one, many }) => ({
  user: one(users, {
    fields: [driverDocuments.userId],
    references: [users.id],
  }),
  fileAttachments: many(fileAttachments),
}));

// ==================== VEHICLE ASSIGNMENTS ====================
export const vehicleAssignments = pgTable("vehicle_assignments", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  assignedFrom: date("assigned_from").notNull(),
  assignedTo: date("assigned_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vehicleAssignmentsRelations = relations(vehicleAssignments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleAssignments.vehicleId],
    references: [vehicles.id],
  }),
  user: one(users, {
    fields: [vehicleAssignments.userId],
    references: [users.id],
  }),
}));

// ==================== FILE ATTACHMENTS ====================
export const fileAttachments = pgTable("file_attachments", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 1024 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  deadlineOperationId: integer("deadline_operation_id").references(
    () => deadlineOperations.id,
    { onDelete: "cascade" }
  ),
  driverDocumentId: integer("driver_document_id").references(
    () => driverDocuments.id,
    { onDelete: "cascade" }
  ),
  uploadedById: integer("uploaded_by_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fileAttachmentsRelations = relations(fileAttachments, ({ one }) => ({
  deadlineOperation: one(deadlineOperations, {
    fields: [fileAttachments.deadlineOperationId],
    references: [deadlineOperations.id],
  }),
  driverDocument: one(driverDocuments, {
    fields: [fileAttachments.driverDocumentId],
    references: [driverDocuments.id],
  }),
  uploadedBy: one(users, {
    fields: [fileAttachments.uploadedById],
    references: [users.id],
  }),
}));

// ==================== AUDIT LOGS ====================
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  entityId: integer("entity_id").notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
