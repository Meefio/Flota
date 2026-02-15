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

interface Driver {
  id: number;
  email: string;
  name: string;
}

export function DriverList({ drivers }: { drivers: Driver[] }) {
  const router = useRouter();

  if (drivers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Brak kierowców do wyświetlenia
      </div>
    );
  }

  const handleRowClick = (driverId: number) => {
    router.push(`/admin/kierowcy/${driverId}`);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    driverId: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(driverId);
    }
  };

  return (
    <div className="min-w-0 overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imię i nazwisko</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow
              key={driver.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none focus-visible:bg-muted/50"
              onClick={() => handleRowClick(driver.id)}
              onKeyDown={(e) => handleRowKeyDown(e, driver.id)}
              aria-label={`Szczegóły kierowcy ${driver.name}`}
            >
              <TableCell className="font-medium">{driver.name}</TableCell>
              <TableCell>{driver.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
