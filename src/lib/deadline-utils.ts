import { differenceInDays, parseISO } from "date-fns";

export type DeadlineStatus = "ok" | "warning" | "urgent" | "expired";

export function getDeadlineStatus(expiresAt: string): DeadlineStatus {
  const days = differenceInDays(parseISO(expiresAt), new Date());
  if (days < 0) return "expired";
  if (days <= 7) return "urgent";
  if (days <= 30) return "warning";
  return "ok";
}

export function getDaysUntilExpiry(expiresAt: string): number {
  return differenceInDays(parseISO(expiresAt), new Date());
}

export const DEADLINE_STATUS_CONFIG: Record<
  DeadlineStatus,
  { label: string; color: string; badgeVariant: string }
> = {
  ok: {
    label: "OK",
    color: "text-green-700 bg-green-50 border-green-200",
    badgeVariant: "bg-green-100 text-green-800 border-green-300",
  },
  warning: {
    label: "Uwaga",
    color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    badgeVariant: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  urgent: {
    label: "Pilne",
    color: "text-red-700 bg-red-50 border-red-200",
    badgeVariant: "bg-red-100 text-red-800 border-red-300 animate-pulse",
  },
  expired: {
    label: "Przeterminowane",
    color: "text-red-900 bg-red-100 border-red-300",
    badgeVariant: "bg-red-200 text-red-900 border-red-400",
  },
};
