"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { Eye } from "lucide-react";

interface Vehicle {
  id: number;
  type: string;
  registrationNumber: string;
  vin: string | null;
  brand: string;
  model: string;
  year: number | null;
}

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Brak pojazdów do wyświetlenia
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
            <TableHead>Nr rejestracyjny</TableHead>
            <TableHead className="hidden md:table-cell">VIN</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Marka / Model</TableHead>
            <TableHead className="hidden sm:table-cell">Rok</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none focus-visible:bg-muted/50"
              onClick={() => handleRowClick(vehicle.id)}
              onKeyDown={(e) => handleRowKeyDown(e, vehicle.id)}
            >
              <TableCell className="font-medium">
                {vehicle.registrationNumber}
              </TableCell>
              <TableCell className="hidden md:table-cell font-mono text-xs uppercase text-muted-foreground">
                {vehicle.vin ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {VEHICLE_TYPE_LABELS[vehicle.type] ?? vehicle.type}
                </Badge>
              </TableCell>
              <TableCell>
                {vehicle.brand} {vehicle.model}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {vehicle.year ?? "—"}
              </TableCell>
              <TableCell
                className="text-right"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/pojazdy/${vehicle.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Szczegóły
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
