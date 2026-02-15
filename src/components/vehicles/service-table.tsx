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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Typ</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead>Pojazd</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="hidden md:table-cell">Przebieg</TableHead>
            <TableHead className="hidden lg:table-cell">Warsztat</TableHead>
            <TableHead className="text-right">Koszt</TableHead>
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
              <TableCell>
                <Badge variant="outline">
                  {SERVICE_TYPE_LABELS[service.type as ServiceType] ?? service.type}
                </Badge>
              </TableCell>
              <TableCell className="font-medium max-w-[200px] truncate" title={service.description}>
                {service.description}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {service.registrationNumber}
                <span className="hidden sm:inline text-muted-foreground">
                  {" "}
                  — {service.vehicleBrand} {service.vehicleModel}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {new Date(service.performedAt).toLocaleDateString("pl-PL")}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {service.mileage != null
                  ? `${service.mileage.toLocaleString("pl-PL")} km`
                  : "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[140px] truncate" title={service.workshop ?? undefined}>
                {service.workshop ?? "—"}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
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
