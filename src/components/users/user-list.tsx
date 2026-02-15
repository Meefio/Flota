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

interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "driver";
  isActive: boolean;
  createdAt: Date;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  driver: "Kierowca",
};

export function UserList({ users }: { users: User[] }) {
  const router = useRouter();

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Brak użytkowników do wyświetlenia
      </div>
    );
  }

  const handleRowClick = (userId: number) => {
    router.push(`/admin/uzytkownicy/${userId}`);
  };

  const handleRowKeyDown = (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    userId: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(userId);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imię i nazwisko</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rola</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none focus-visible:bg-muted/50"
              onClick={() => handleRowClick(user.id)}
              onKeyDown={(e) => handleRowKeyDown(e, user.id)}
              aria-label={`Użytkownik ${user.name}`}
            >
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {ROLE_LABELS[user.role] ?? user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "outline" : "destructive"}>
                  {user.isActive ? "Aktywny" : "Nieaktywny"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
