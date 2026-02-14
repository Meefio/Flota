"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
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

export function MobileNav({ role }: { role: "admin" | "driver" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const items = role === "admin" ? ADMIN_NAV_ITEMS : DRIVER_NAV_ITEMS;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">FlotaApp</h1>
        </div>
        <nav className="p-4 space-y-1">
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
                onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
