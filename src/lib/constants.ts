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
  { label: "Panel główny", href: "/admin", icon: "LayoutDashboard" },
  { label: "Pojazdy", href: "/admin/pojazdy", icon: "Truck" },
  { label: "Serwisy", href: "/admin/serwisy", icon: "Wrench" },
  { label: "Kierowcy", href: "/admin/kierowcy", icon: "Users" },
  { label: "Użytkownicy", href: "/admin/uzytkownicy", icon: "UserCog" },
  { label: "Kalendarz", href: "/admin/kalendarz", icon: "Calendar" },
  { label: "Logi", href: "/admin/logi", icon: "FileText" },
  { label: "Profil", href: "/admin/profil", icon: "User" },
] as const;

export const DRIVER_NAV_ITEMS = [
  { label: "Pojazdy", href: "/kierowca/pojazdy", icon: "Truck" },
  { label: "Dokumenty", href: "/kierowca/dokumenty", icon: "FileText" },
  { label: "Profil", href: "/kierowca/profil", icon: "User" },
] as const;

export const AUTHORIZATION_DOCUMENTS: DriverDocumentType[] = [
  "upowaznienie_pojazd",
  "upowaznienie_naczepa",
];

export const EXPIRY_DOCUMENTS: DriverDocumentType[] = ["a1", "imi", "ekuz"];

/** Etykiety akcji w logach audytu (używane w powiadomieniach i stronie Logi). */
export const AUDIT_ACTION_LABELS: Record<string, string> = {
  "vehicle.create": "Dodanie pojazdu",
  "vehicle.update": "Edycja pojazdu",
  "vehicle.delete": "Usunięcie pojazdu",
  "driver.create": "Dodanie kierowcy",
  "driver.update": "Edycja kierowcy",
  "driver.deactivate": "Dezaktywacja kierowcy",
  "driver.password_reset": "Reset hasła kierowcy",
  "deadline.operation": "Operacja terminu",
  "assignment.create": "Przypisanie kierowcy",
  "assignment.end": "Odłączenie kierowcy",
  "service.create": "Dodanie serwisu",
  "service.update": "Edycja serwisu",
  "service.delete": "Usunięcie serwisu",
  "driver_document.update": "Aktualizacja dokumentu kierowcy",
  "note.create": "Dodanie notatki",
  "note.toggle": "Zmiana statusu notatki",
  "note.delete": "Usunięcie notatki",
  "user.create": "Dodanie użytkownika",
  "user.update": "Edycja użytkownika",
  "user.deactivate": "Dezaktywacja użytkownika",
  "user.activate": "Aktywacja użytkownika",
  "user.password_reset": "Reset hasła użytkownika",
};

/** Etykiety typów encji w logach audytu (kolumna Typ). */
export const AUDIT_ENTITY_TYPE_LABELS: Record<string, string> = {
  vehicle: "Pojazd",
  vehicle_service: "Serwis pojazdu",
  driver: "Kierowca",
  user: "Użytkownik",
  vehicle_assignment: "Przypisanie",
  assignment: "Przypisanie",
  driver_document: "Dokument kierowcy",
  vehicle_note: "Notatka",
};
