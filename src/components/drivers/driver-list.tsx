import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

interface Driver {
  id: number;
  email: string;
  name: string;
}

export function DriverList({ drivers }: { drivers: Driver[] }) {
  if (drivers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Brak kierowców do wyświetlenia
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imię i nazwisko</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell className="font-medium">{driver.name}</TableCell>
              <TableCell>{driver.email}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/kierowcy/${driver.id}`}>
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
