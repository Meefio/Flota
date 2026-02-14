"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Wrench,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import { ADMIN_NAV_ITEMS, DRIVER_NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Truck,
  Wrench,
  Users,
  Calendar,
  FileText,
};

export function Sidebar({ role }: { role: "admin" | "driver" }) {
  const pathname = usePathname();
  const items = role === "admin" ? ADMIN_NAV_ITEMS : DRIVER_NAV_ITEMS;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="p-6 border-b">
        <Link href={role === "admin" ? "/admin" : "/kierowca"}>
          <h1 className="text-xl font-bold">FlotaApp</h1>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === `/${role === "admin" ? "admin" : "kierowca"}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
