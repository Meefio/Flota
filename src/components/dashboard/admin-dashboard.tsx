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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ciągniki
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trucks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Naczepy
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trailers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Kierowcy
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drivers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pilne terminy
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats.urgentDeadlines.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilne terminy (≤7 dni)</CardTitle>
        </CardHeader>
        <CardContent>
          <DeadlineAlerts deadlines={stats.urgentDeadlines} />
        </CardContent>
      </Card>
    </div>
  );
}
