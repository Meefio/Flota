import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeadlineAlerts } from "./deadline-alerts";
import { Truck, Users, AlertTriangle } from "lucide-react";

interface AdminDashboardProps {
  stats: {
    trucks: number;
    trailers: number;
    drivers: number;
    urgentDeadlines: {
      id: number;
      vehicleId: number;
      type: string;
      expiresAt: string;
      vehicleRegistration: string;
      status: string;
    }[];
  };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid gap-3 md:gap-4 md:grid-cols-4">
        <Link
          href="/admin/pojazdy"
          className="block transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted/50"
          aria-label="Przejdź do listy pojazdów – ciągniki"
        >
          <Card className="py-3 gap-2 md:py-6 md:gap-6 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 md:px-6 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
                Ciągniki
              </CardTitle>
              <Truck className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="px-4 pt-0 md:px-6">
              <div className="text-xl font-bold md:text-2xl">{stats.trucks}</div>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/pojazdy"
          className="block transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted/50"
          aria-label="Przejdź do listy pojazdów – naczepy"
        >
          <Card className="py-3 gap-2 md:py-6 md:gap-6 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 md:px-6 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
                Naczepy
              </CardTitle>
              <Truck className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="px-4 pt-0 md:px-6">
              <div className="text-xl font-bold md:text-2xl">{stats.trailers}</div>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/kierowcy"
          className="block transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted/50"
          aria-label="Przejdź do listy kierowców"
        >
          <Card className="py-3 gap-2 md:py-6 md:gap-6 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 md:px-6 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
                Kierowcy
              </CardTitle>
              <Users className="h-3.5 w-3.5 text-muted-foreground md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="px-4 pt-0 md:px-6">
              <div className="text-xl font-bold md:text-2xl">{stats.drivers}</div>
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admin/kalendarz"
          className="block transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted/50"
          aria-label="Przejdź do kalendarza – pilne terminy"
        >
          <Card className="py-3 gap-2 md:py-6 md:gap-6 cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 px-4 md:px-6 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground md:text-sm">
                Pilne terminy
              </CardTitle>
              <AlertTriangle className="h-3.5 w-3.5 text-destructive md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="px-4 pt-0 md:px-6">
              <div className="text-xl font-bold text-destructive md:text-2xl">
                {stats.urgentDeadlines.length}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="py-4 md:py-6">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-lg">
            Pilne terminy (≤7 dni)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <DeadlineAlerts deadlines={stats.urgentDeadlines} />
        </CardContent>
      </Card>
    </div>
  );
}
