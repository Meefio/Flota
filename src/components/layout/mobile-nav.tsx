"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  UserCog,
  Calendar,
  FileText,
  User,
} from "lucide-react";
import { ADMIN_NAV_ITEMS, DRIVER_NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Truck,
  Wrench,
  Users,
  UserCog,
  Calendar,
  FileText,
  User,
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
        <div className="p-4 border-b flex justify-center items-center min-h-[6.5rem]">
          <Link
            href={role === "admin" ? "/admin" : "/kierowca"}
            onClick={() => setOpen(false)}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            aria-label="Strona główna"
          >
            <Image
              src="/logo.png"
              alt="W.G. Invest Group Sp. z o.o."
              width={320}
              height={88}
              className="h-20 w-auto max-w-full object-contain"
              unoptimized
            />
          </Link>
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
