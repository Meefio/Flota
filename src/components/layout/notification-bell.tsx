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
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { AUDIT_ACTION_LABELS } from "@/lib/constants";
import type { RecentAuditEntry } from "@/lib/queries/audit";

interface NotificationBellProps {
  urgentCount: number;
  recentAuditLogs: RecentAuditEntry[];
}

export function NotificationBell({
  urgentCount,
  recentAuditLogs,
}: NotificationBellProps) {
  const driverLogsCount = recentAuditLogs.filter(
    (e) => e.userRole === "driver"
  ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            urgentCount > 0 || driverLogsCount > 0
              ? `Powiadomienia: ${urgentCount > 0 ? `${urgentCount} pilnych terminów` : ""} ${driverLogsCount > 0 ? `${driverLogsCount} zmian od kierowców` : ""}`
              : "Powiadomienia"
          }
        >
          <Bell className="h-5 w-5" />
          {urgentCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs"
              aria-hidden
            >
              {urgentCount > 99 ? "99+" : urgentCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(90vw,380px)] max-h-[70vh] overflow-y-auto"
      >
        {urgentCount > 0 && (
          <>
            <div className="px-2 py-2">
              <Link
                href="/admin"
                className="text-sm font-medium text-destructive hover:underline"
              >
                Pilne terminy: {urgentCount} bliskich upływu
              </Link>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ostatnie zmiany w aplikacji
          </p>
        </div>
        {recentAuditLogs.length === 0 ? (
          <div className="px-2 py-3 text-sm text-muted-foreground">
            Brak ostatnich zmian
          </div>
        ) : (
          <ul className="max-h-[50vh] overflow-y-auto" role="list">
            {recentAuditLogs.map((entry) => (
              <li
                key={entry.id}
                className="border-b border-border/50 last:border-0 px-2 py-2 text-sm"
              >
                <span
                  className={entry.userRole === "driver" ? "font-medium" : ""}
                >
                  {entry.userRole === "driver" && (
                    <span className="text-primary" aria-hidden>
                      Kierowca{" "}
                    </span>
                  )}
                  {entry.userName}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  — {AUDIT_ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {format(entry.createdAt, "dd.MM.yyyy HH:mm", { locale: pl })}
                </div>
              </li>
            ))}
          </ul>
        )}
        <DropdownMenuSeparator />
        <div className="p-1">
          <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
            <Link href="/admin/logi">Zobacz pełną historię zmian</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
