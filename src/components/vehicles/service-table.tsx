"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import type { ServiceType } from "@/db/schema";

interface ServiceRow {
  id: number;
  type: string;
  description: string;
  performedAt: string;
  cost: string | null;
  mileage: number | null;
  workshop: string | null;
  notes: string | null;
  vehicleId: number;
  registrationNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  createdByName: string;
}

export function ServiceTable({ services }: { services: ServiceRow[] }) {
  const router = useRouter();

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground rounded-md border">
        Brak wpisów serwisowych do wyświetlenia
      </div>
    );
  }

  const handleRowClick = (vehicleId: number) => {
    router.push(`/admin/pojazdy/${vehicleId}`);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    vehicleId: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(vehicleId);
    }
  };

  return (
    <div className="rounded-md border text-xs sm:text-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Typ</TableHead>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Opis</TableHead>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Pojazd</TableHead>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Data</TableHead>
            <TableHead className="hidden md:table-cell h-8 px-1.5 md:h-10 md:px-2">Przebieg</TableHead>
            <TableHead className="hidden lg:table-cell h-8 px-1.5 lg:h-10 lg:px-2">Warsztat</TableHead>
            <TableHead className="h-8 px-1.5 text-right sm:h-10 sm:px-2">Koszt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow
              key={service.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none focus-visible:bg-muted/50"
              onClick={() => handleRowClick(service.vehicleId)}
              onKeyDown={(e) => handleRowKeyDown(e, service.vehicleId)}
              aria-label={`Serwis: ${service.description}, pojazd ${service.registrationNumber}`}
            >
              <TableCell className="p-1.5 sm:p-2">
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  {SERVICE_TYPE_LABELS[service.type as ServiceType] ?? service.type}
                </Badge>
              </TableCell>
              <TableCell className="p-1.5 font-medium max-w-[120px] truncate sm:max-w-[200px] sm:p-2" title={service.description}>
                {service.description}
              </TableCell>
              <TableCell className="whitespace-nowrap p-1.5 sm:p-2">
                {service.registrationNumber}
                <span className="hidden sm:inline text-muted-foreground">
                  {" "}
                  — {service.vehicleBrand} {service.vehicleModel}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap p-1.5 sm:p-2">
                {new Date(service.performedAt).toLocaleDateString("pl-PL")}
              </TableCell>
              <TableCell className="hidden p-1.5 text-muted-foreground md:table-cell md:p-2">
                {service.mileage != null
                  ? `${service.mileage.toLocaleString("pl-PL")} km`
                  : "—"}
              </TableCell>
              <TableCell className="hidden max-w-[140px] truncate text-muted-foreground lg:table-cell lg:p-2" title={service.workshop ?? undefined}>
                {service.workshop ?? "—"}
              </TableCell>
              <TableCell className="p-1.5 text-right font-medium tabular-nums sm:p-2">
                {service.cost
                  ? Number(service.cost).toLocaleString("pl-PL", {
                      style: "currency",
                      currency: "PLN",
                    })
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
