"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import { deletePlannedService } from "@/lib/actions/planned-services";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { ServiceType } from "@/db/schema";

interface PlannedServiceRow {
  id: number;
  vehicleId: number;
  type: string;
  plannedDate: string;
  notes: string | null;
  registrationNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
}

function isPast(dateStr: string) {
  return dateStr < new Date().toISOString().slice(0, 10);
}

function PlannedServiceDeleteButton({ id }: { id: number }) {
  const [isDeleting, startTransition] = useTransition();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Czy na pewno chcesz usunąć ten zaplanowany serwis?")) return;
    startTransition(async () => {
      const result = await deletePlannedService(id);
      if ("error" in result) {
        toast.error("Nie udało się usunąć zaplanowanego serwisu");
      } else {
        toast.success("Zaplanowany serwis usunięty");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Usuń zaplanowany serwis"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}

export function PlannedServiceTable({ plannedServices }: { plannedServices: PlannedServiceRow[] }) {
  const router = useRouter();

  if (plannedServices.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground rounded-md border">
        Brak zaplanowanych serwisów
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
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Pojazd</TableHead>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2">Planowana data</TableHead>
            <TableHead className="hidden sm:table-cell h-8 px-1.5 sm:h-10 sm:px-2">Notatki</TableHead>
            <TableHead className="h-8 px-1.5 sm:h-10 sm:px-2 w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plannedServices.map((planned) => {
            const overdue = isPast(planned.plannedDate);
            return (
              <TableRow
                key={planned.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer focus:outline-none focus-visible:bg-muted/50"
                onClick={() => handleRowClick(planned.vehicleId)}
                onKeyDown={(e) => handleRowKeyDown(e, planned.vehicleId)}
              >
                <TableCell className="p-1.5 sm:p-2">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    {SERVICE_TYPE_LABELS[planned.type as ServiceType] ?? planned.type}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap p-1.5 sm:p-2">
                  {planned.registrationNumber}
                  <span className="hidden sm:inline text-muted-foreground">
                    {" "}— {planned.vehicleBrand} {planned.vehicleModel}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap p-1.5 sm:p-2">
                  <span className={overdue ? "text-destructive font-medium" : ""}>
                    {new Date(planned.plannedDate).toLocaleDateString("pl-PL")}
                  </span>
                  {overdue && (
                    <Badge variant="destructive" className="ml-2 text-[10px] sm:text-xs">
                      Zaległy
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell max-w-[200px] truncate text-muted-foreground p-1.5 sm:p-2" title={planned.notes ?? undefined}>
                  {planned.notes ?? "—"}
                </TableCell>
                <TableCell className="p-1.5 sm:p-2">
                  <PlannedServiceDeleteButton id={planned.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
