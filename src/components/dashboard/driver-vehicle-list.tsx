import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import {
  DEADLINE_TYPE_LABELS,
  DEADLINE_TYPES_FOR_VEHICLE,
  VEHICLE_TYPE_LABELS,
} from "@/lib/constants";
import type { DeadlineType } from "@/db/schema";

export interface DriverVehicleListItem {
  vehicleId: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  deadlines: { id: number; type: string; expiresAt: string }[];
}

interface DriverVehicleListProps {
  vehicles: DriverVehicleListItem[];
}

export function DriverVehicleList({ vehicles }: DriverVehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Brak przypisanych pojazdów
      </p>
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
    </div>
  );
}
