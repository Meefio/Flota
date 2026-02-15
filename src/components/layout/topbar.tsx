"use client";

import Image from "next/image";
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
import type { RecentAuditEntry } from "@/lib/queries/audit";

interface TopbarProps {
  userName: string;
  role: "admin" | "driver";
  urgentCount?: number;
  recentAuditLogs?: RecentAuditEntry[];
}

export function Topbar({
  userName,
  role,
  urgentCount = 0,
  recentAuditLogs = [],
}: TopbarProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <MobileNav role={role} />
        <Image
          src="/logo.png"
          alt="W.G. Invest Group Sp. z o.o."
          width={240}
          height={64}
          className="h-14 w-auto object-contain md:hidden"
          unoptimized
        />
      </div>
      <div className="flex items-center gap-3">
        {role === "admin" && (
          <NotificationBell
            urgentCount={urgentCount}
            recentAuditLogs={recentAuditLogs}
          />
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
