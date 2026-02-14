"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NotificationBell({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <Button asChild variant="ghost" size="icon" className="relative">
      <Link href="/admin">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      </Link>
    </Button>
  );
}
