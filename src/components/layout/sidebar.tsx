"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
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

export function Sidebar({ role }: { role: "admin" | "driver" }) {
  const pathname = usePathname();
  const items = role === "admin" ? ADMIN_NAV_ITEMS : DRIVER_NAV_ITEMS;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="p-4 border-b flex justify-center items-center min-h-[6.5rem]">
        <Link
          href={role === "admin" ? "/admin" : "/kierowca"}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          aria-label="Strona główna"
        >
          <Image
            src="/logo.png"
            alt="W.G. Invest Group Sp. z o.o."
            width={320}
            height={88}
            className="h-20 w-auto max-w-full object-contain"
            priority
            unoptimized
          />
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
