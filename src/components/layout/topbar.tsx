"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { NotificationBell } from "./notification-bell";
import { DriverNotificationBell } from "./notification-bell-driver";
import type { RecentAuditEntry } from "@/lib/queries/audit";

interface DriverTask {
  id: number;
  content: string;
  vehicleId: number;
  registrationNumber: string;
}

interface TopbarProps {
  userName: string;
  role: "admin" | "driver";
  urgentCount?: number;
  recentAuditLogs?: RecentAuditEntry[];
  driverTasks?: DriverTask[];
}

export function Topbar({
  userName,
  role,
  urgentCount = 0,
  recentAuditLogs = [],
  driverTasks = [],
}: TopbarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-14 min-w-0 items-center justify-between gap-2 border-b bg-card px-4 sticky top-0 z-50">
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <MobileNav role={role} />
        <Link
          href={role === "admin" ? "/admin" : "/kierowca"}
          className="block min-w-0 flex-1 md:flex-initial"
          aria-label="Strona główna"
        >
          <Image
            src="/logo.png"
            alt="W.G. Invest Group Sp. z o.o."
            width={240}
            height={64}
            className="h-14 w-auto max-w-[160px] object-contain object-left md:max-w-[220px] md:hidden"
            unoptimized
          />
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {role === "admin" && (
          <NotificationBell
            urgentCount={urgentCount}
            recentAuditLogs={recentAuditLogs}
          />
        )}
        {role === "driver" && (
          <DriverNotificationBell tasks={driverTasks} />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              {role === "admin" ? "Administrator" : "Kierowca"}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={role === "admin" ? "/admin/profil" : "/kierowca/profil"}
                className="flex items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Moje konto
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj się
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
