"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface AssignedTask {
  id: number;
  content: string;
  vehicleId: number;
  registrationNumber: string;
}

interface DriverNotificationBellProps {
  tasks: AssignedTask[];
}

export function DriverNotificationBell({ tasks }: DriverNotificationBellProps) {
  const count = tasks.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            count > 0
              ? `Zadania: ${count} do wykonania`
              : "Brak zadań"
          }
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
              aria-hidden
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(90vw,380px)] max-h-[70vh] overflow-y-auto"
      >
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Przypisane zadania
          </p>
        </div>
        {tasks.length === 0 ? (
          <div className="px-2 py-3 text-sm text-muted-foreground">
            Brak przypisanych zadań
          </div>
        ) : (
          <ul className="max-h-[50vh] overflow-y-auto" role="list">
            {tasks.slice(0, 10).map((task) => (
              <li key={task.id} className="border-b border-border/50 last:border-0">
                <Link
                  href={`/kierowca/pojazdy/${task.vehicleId}`}
                  className="block px-2 py-2 text-sm hover:bg-accent rounded-sm"
                >
                  <span className="font-medium">{task.registrationNumber}</span>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2">
                    {task.content}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            asChild
          >
            <Link href="/kierowca/zadania">Zobacz wszystkie zadania</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
