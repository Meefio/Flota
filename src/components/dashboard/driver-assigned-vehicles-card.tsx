"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Truck, ChevronRight } from "lucide-react";

export interface DriverAssignedVehicleItem {
  assignmentId: number;
  vehicleId: number;
  registrationNumber: string;
  brand: string;
  model: string;
  type: string;
  assignedFrom: string;
  notes: string | null;
}

interface DriverAssignedVehiclesCardProps {
  vehicles: DriverAssignedVehicleItem[];
}

export function DriverAssignedVehiclesCard({ vehicles }: DriverAssignedVehiclesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Truck className="h-5 w-5" aria-hidden />
          Przypisane pojazdy
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="shrink-0"
        >
          <Link
            href="/kierowca/pojazdy"
            aria-label="Przejdź do listy moich pojazdów"
          >
            Moje pojazdy
            <ChevronRight className="h-4 w-4 ml-1" aria-hidden />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nie masz obecnie przypisanych pojazdów. Zmiana przypisań należy do
            administratora.
          </p>
        ) : (
          <ul className="space-y-3" role="list">
            {vehicles.map((v) => (
              <li key={v.assignmentId}>
                <Link
                  href={`/kierowca/pojazdy/${v.vehicleId}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Szczegóły pojazdu ${v.registrationNumber}`}
                  tabIndex={0}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {v.registrationNumber}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {v.brand} {v.model} ·{" "}
                      {VEHICLE_TYPE_LABELS[v.type] ?? v.type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Od:{" "}
                      {format(new Date(v.assignedFrom), "d MMM yyyy", {
                        locale: pl,
                      })}
                    </p>
                    {v.notes && (
                      <p className="text-xs text-muted-foreground italic mt-1 truncate">
                        {v.notes}
                      </p>
                    )}
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground ml-2"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
