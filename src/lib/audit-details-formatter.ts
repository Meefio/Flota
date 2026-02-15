import {
  VEHICLE_TYPE_LABELS,
  SERVICE_TYPE_LABELS,
  DEADLINE_TYPE_LABELS,
  DRIVER_DOCUMENT_LABELS,
} from "@/lib/constants";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

const formatDate = (value: unknown): string => {
  if (value == null) return "—";
  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return format(d, "dd.MM.yyyy", { locale: pl });
    }
  }
  return String(value);
};

const formatValue = (value: unknown): string => {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Tak" : "Nie";
  return String(value);
};

/**
 * Formatuje szczegóły wpisu audytu do czytelnego opisu po polsku.
 * Dla akcji update z polem previous/current wyświetla diff (co się zmieniło).
 */
export function formatAuditDetails(
  action: string,
  entityType: string,
  details: Record<string, unknown> | null
): string {
  if (!details || typeof details !== "object") return "—";

  const d = details as Record<string, unknown>;

  // Diff dla vehicle.update / driver.update (gdy w details jest previous i current)
  if (
    (action === "vehicle.update" || action === "driver.update") &&
    d.previous &&
    d.current &&
    typeof d.previous === "object" &&
    typeof d.current === "object"
  ) {
    return formatDetailsDiff(
      action,
      entityType,
      d.previous as Record<string, unknown>,
      d.current as Record<string, unknown>
    );
  }

  // Update bez previous (np. stary wpis lub brak rekordu) — formatuj current jako snapshot
  if (
    (action === "vehicle.update" || action === "driver.update") &&
    d.current &&
    typeof d.current === "object"
  ) {
    return formatAuditDetails(action, entityType, d.current as Record<string, unknown>);
  }

  // Pojedynczy snapshot (create/update bez diff)
  switch (entityType) {
    case "vehicle": {
      const parts: string[] = [];
      if (d.registrationNumber != null)
        parts.push(`Rejestracja: ${formatValue(d.registrationNumber)}`);
      if (d.vin != null) parts.push(`VIN: ${formatValue(d.vin)}`);
      if (d.brand != null) parts.push(`Marka: ${formatValue(d.brand)}`);
      if (d.model != null) parts.push(`Model: ${formatValue(d.model)}`);
      if (d.type != null)
        parts.push(`Typ: ${VEHICLE_TYPE_LABELS[String(d.type)] ?? formatValue(d.type)}`);
      if (d.year != null) parts.push(`Rok: ${formatValue(d.year)}`);
      if (d.notes != null && d.notes !== "")
        parts.push(`Notatki: ${formatValue(d.notes)}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }

    case "vehicle_service": {
      const parts: string[] = [];
      if (d.type != null)
        parts.push(
          `Typ: ${(SERVICE_TYPE_LABELS as Record<string, string>)[String(d.type)] ?? formatValue(d.type)}`
        );
      if (d.cost != null) parts.push(`Koszt: ${formatValue(d.cost)} zł`);
      if (d.mileage != null) parts.push(`Przebieg: ${formatValue(d.mileage)} km`);
      if (d.workshop != null) parts.push(`Warsztat: ${formatValue(d.workshop)}`);
      if (d.performedAt != null)
        parts.push(`Data wykonania: ${formatDate(d.performedAt)}`);
      if (d.description != null) parts.push(`Opis: ${formatValue(d.description)}`);
      if (d.notes != null && d.notes !== "")
        parts.push(`Notatki: ${formatValue(d.notes)}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }

    case "driver": {
      const parts: string[] = [];
      if (d.name != null) parts.push(`Imię i nazwisko: ${formatValue(d.name)}`);
      if (d.email != null) parts.push(`Email: ${formatValue(d.email)}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }

    case "vehicle_assignment": {
      const parts: string[] = [];
      if (d.vehicleId != null) parts.push(`Pojazd ID: ${formatValue(d.vehicleId)}`);
      if (d.userId != null) parts.push(`Kierowca ID: ${formatValue(d.userId)}`);
      if (d.assignedFrom != null)
        parts.push(`Data od: ${formatDate(d.assignedFrom)}`);
      if (d.notes != null && d.notes !== "")
        parts.push(`Notatki: ${formatValue(d.notes)}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }

    case "driver_document": {
      const parts: string[] = [];
      if (d.type != null)
        parts.push(
          `Typ: ${(DRIVER_DOCUMENT_LABELS as Record<string, string>)[String(d.type)] ?? formatValue(d.type)}`
        );
      if (d.expiresAt != null)
        parts.push(`Data ważności: ${formatDate(d.expiresAt)}`);
      if (d.isActive != null)
        parts.push(`Aktywny: ${d.isActive ? "Tak" : "Nie"}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }

    case "vehicle_note": {
      const parts: string[] = [];
      if (d.vehicleId != null) parts.push(`Pojazd ID: ${formatValue(d.vehicleId)}`);
      if (d.contentPreview != null)
        parts.push(`Treść: ${formatValue(d.contentPreview)}`);
      if (d.isDone != null) parts.push(`Wykonano: ${d.isDone ? "Tak" : "Nie"}`);
      return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
    }
  }

  // deadline.operation (entityType vehicle, action deadline.operation)
  if (action === "deadline.operation") {
    const parts: string[] = [];
    if (d.deadlineType != null)
      parts.push(
        `Termin: ${(DEADLINE_TYPE_LABELS as Record<string, string>)[String(d.deadlineType)] ?? formatValue(d.deadlineType)}`
      );
    if (d.newExpiryDate != null)
      parts.push(`Nowa data: ${formatDate(d.newExpiryDate)}`);
    return parts.length > 0 ? parts.join(", ") : fallbackFormat(d);
  }

  return fallbackFormat(d);
}

const VEHICLE_FIELD_LABELS: Record<string, string> = {
  registrationNumber: "Rejestracja",
  vin: "VIN",
  brand: "Marka",
  model: "Model",
  type: "Typ",
  year: "Rok",
  notes: "Notatki",
};

const DRIVER_FIELD_LABELS: Record<string, string> = {
  name: "Imię i nazwisko",
  email: "Email",
};

function formatDetailsDiff(
  action: string,
  entityType: string,
  previous: Record<string, unknown>,
  current: Record<string, unknown>
): string {
  const fieldLabels =
    entityType === "vehicle" ? VEHICLE_FIELD_LABELS : DRIVER_FIELD_LABELS;
  const typeLabels =
    entityType === "vehicle" ? VEHICLE_TYPE_LABELS : undefined;

  const parts: string[] = [];
  const allKeys = new Set([
    ...Object.keys(previous),
    ...Object.keys(current),
  ]);

  for (const key of allKeys) {
    const prev = previous[key];
    const curr = current[key];
    const prevStr = formatValue(prev);
    const currStr = formatValue(curr);
    if (prevStr === currStr) continue;

    const label = fieldLabels[key] ?? key;
    let fromStr = prevStr;
    let toStr = currStr;
    if (key === "type" && typeLabels) {
      fromStr = typeLabels[String(prev)] ?? prevStr;
      toStr = typeLabels[String(curr)] ?? currStr;
    }
    parts.push(`${label}: ${fromStr} → ${toStr}`);
  }

  return parts.length > 0 ? parts.join("; ") : fallbackFormat(current);
}

function fallbackFormat(d: Record<string, unknown>): string {
  const parts = Object.entries(d)
    .filter(([, v]) => v != null && v !== "")
    .map(([k, v]) => `${k}: ${formatValue(v)}`);
  return parts.length > 0 ? parts.join(", ") : "—";
}
