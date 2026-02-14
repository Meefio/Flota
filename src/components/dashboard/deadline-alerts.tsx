import Link from "next/link";
import { DEADLINE_TYPE_LABELS } from "@/lib/constants";
import {
  DEADLINE_STATUS_CONFIG,
  getDaysUntilExpiry,
} from "@/lib/deadline-utils";
import type { DeadlineType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface DeadlineAlert {
  id: number;
  vehicleId: number;
  type: string;
  expiresAt: string;
  vehicleRegistration: string;
  status: string;
}

export function DeadlineAlerts({ deadlines }: { deadlines: DeadlineAlert[] }) {
  if (deadlines.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Brak pilnych terminów
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {deadlines.map((d) => {
        const days = getDaysUntilExpiry(d.expiresAt);
        const config =
          DEADLINE_STATUS_CONFIG[d.status as keyof typeof DEADLINE_STATUS_CONFIG];

        return (
          <Link
            key={d.id}
            href={`/admin/pojazdy/${d.vehicleId}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-colors hover:opacity-80",
              config?.color
            )}
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {d.vehicleRegistration} —{" "}
                {DEADLINE_TYPE_LABELS[d.type as DeadlineType]}
              </p>
              <p className="text-xs opacity-75">
                {days < 0
                  ? `${Math.abs(days)} dni po terminie`
                  : days === 0
                  ? "Wygasa dziś!"
                  : `Wygasa za ${days} dni`}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
