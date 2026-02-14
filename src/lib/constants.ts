import type { DeadlineType, DriverDocumentType } from "@/db/schema";

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  truck: "Ciągnik",
  trailer: "Naczepa",
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

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Pojazdy", href: "/admin/pojazdy", icon: "Truck" },
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
