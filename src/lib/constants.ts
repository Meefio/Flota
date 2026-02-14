import type { DeadlineType, DriverDocumentType, ServiceType } from "@/db/schema";

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  truck: "Ciągnik",
  trailer: "Naczepa",
  bus: "Bus",
  other: "Pozostałe",
};

export const DEADLINE_TYPES_FOR_VEHICLE: Record<string, DeadlineType[]> = {
  truck: ["przeglad", "ubezpieczenie", "tachograf"],
  trailer: ["przeglad", "ubezpieczenie", "tachograf"],
  bus: ["przeglad", "ubezpieczenie", "tachograf"],
  other: ["przeglad", "ubezpieczenie", "tachograf", "winda_udt"],
};

export const DEADLINE_TYPE_LABELS: Record<DeadlineType, string> = {
  przeglad: "Przegląd techniczny",
  ubezpieczenie: "Ubezpieczenie",
  tachograf: "Legalizacja tachografu",
  winda_udt: "Certyfikat UDT (winda)",
};

export const DRIVER_DOCUMENT_LABELS: Record<DriverDocumentType, string> = {
  a1: "Zaświadczenie A1",
  imi: "Karta IMI",
  ekuz: "Karta EKUZ",
  upowaznienie_pojazd: "Upoważnienie do pojazdu",
  upowaznienie_naczepa: "Upoważnienie do naczepy",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  wymiana_oleju: "Wymiana oleju",
  naprawa: "Naprawa",
  opony: "Opony",
  hamulce: "Hamulce",
  elektryka: "Elektryka",
  inne: "Inne",
};

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Pojazdy", href: "/admin/pojazdy", icon: "Truck" },
  { label: "Serwisy", href: "/admin/serwisy", icon: "Wrench" },
  { label: "Kierowcy", href: "/admin/kierowcy", icon: "Users" },
  { label: "Kalendarz", href: "/admin/kalendarz", icon: "Calendar" },
  { label: "Logi", href: "/admin/logi", icon: "FileText" },
] as const;

export const DRIVER_NAV_ITEMS = [
  { label: "Dashboard", href: "/kierowca", icon: "LayoutDashboard" },
  { label: "Dokumenty", href: "/kierowca/dokumenty", icon: "FileText" },
] as const;

export const AUTHORIZATION_DOCUMENTS: DriverDocumentType[] = [
  "upowaznienie_pojazd",
  "upowaznienie_naczepa",
];

export const EXPIRY_DOCUMENTS: DriverDocumentType[] = ["a1", "imi", "ekuz"];
