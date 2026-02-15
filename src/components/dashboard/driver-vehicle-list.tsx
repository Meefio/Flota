import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import {
  DEADLINE_TYPE_LABELS,
  DEADLINE_TYPES_FOR_VEHICLE,
  VEHICLE_TYPE_LABELS,
} from "@/lib/constants";
import type { DeadlineType } from "@/db/schema";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Info } from "lucide-react";

export interface DriverVehicleListItem {
  vehicleId: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  assignedFrom?: string;
  notes?: string | null;
  deadlines: { id: number; type: string; expiresAt: string }[];
}

interface DriverVehicleListProps {
  vehicles: DriverVehicleListItem[];
}

export function DriverVehicleList({ vehicles }: DriverVehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Brak przypisanych pojazdów.
        </p>
        <p className="text-xs text-muted-foreground">
          Zmiana przypisań należy do administratora — skontaktuj się z nim, aby
          otrzymać przypisanie do pojazdu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((v) => (
        <Link
          key={v.vehicleId}
          href={`/kierowca/pojazdy/${v.vehicleId}`}
          aria-label={`Szczegóły pojazdu ${v.registrationNumber}`}
          className="block border rounded-lg p-4 transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium">{v.registrationNumber}</p>
              <p className="text-sm text-muted-foreground">
                {v.brand} {v.model}
                <Badge variant="outline" className="ml-2">
                  {VEHICLE_TYPE_LABELS[v.type]}
                </Badge>
              </p>
            </div>
          </div>
          {v.assignedFrom && (
            <p className="text-xs text-muted-foreground mb-2">
              Przypisany od:{" "}
              {format(new Date(v.assignedFrom), "d MMM yyyy", { locale: pl })}
            </p>
          )}
          {v.notes && (
            <p className="text-xs text-muted-foreground mb-2 italic">
              {v.notes}
            </p>
          )}
          {v.deadlines.length > 0 && (
            <div className="space-y-1">
              {v.deadlines
                .filter((d) =>
                  (DEADLINE_TYPES_FOR_VEHICLE[v.type] ??
                    DEADLINE_TYPES_FOR_VEHICLE.truck
                  ).includes(d.type as DeadlineType)
                )
                .map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {DEADLINE_TYPE_LABELS[d.type as DeadlineType]}
                    </span>
                    <DeadlineBadge expiresAt={d.expiresAt} />
                  </div>
                ))}
            </div>
          )}
        </Link>
      ))}
      <div
        className="flex items-start gap-2 rounded-md border border-muted bg-muted/30 p-3 text-sm text-muted-foreground"
        role="note"
        aria-label="Informacja o zmianie przypisań"
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          Zmiana przypisań do pojazdów należy do administratora. Aby zmienić
          listę przypisanych pojazdów, skontaktuj się z administratorem.
        </p>
      </div>
    </div>
  );
}
