import { cn } from "@/lib/utils";
import {
  getDeadlineStatus,
  getDaysUntilExpiry,
  DEADLINE_STATUS_CONFIG,
} from "@/lib/deadline-utils";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";

interface DeadlineBadgeProps {
  expiresAt: string;
  className?: string;
}

export function DeadlineBadge({ expiresAt, className }: DeadlineBadgeProps) {
  const status = getDeadlineStatus(expiresAt);
  const days = getDaysUntilExpiry(expiresAt);
  const config = DEADLINE_STATUS_CONFIG[status];

  const daysText =
    days < 0
      ? `${Math.abs(days)} dni po terminie`
      : days === 0
      ? "Dziś"
      : `${days} dni`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.badgeVariant,
        className
      )}
    >
      <span>{format(parseISO(expiresAt), "dd.MM.yyyy", { locale: pl })}</span>
      <span className="text-[10px] opacity-75">({daysText})</span>
    </span>
  );
}
