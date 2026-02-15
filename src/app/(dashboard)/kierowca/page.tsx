import { requireDriver } from "@/lib/auth-utils";
import { getDriverDashboard } from "@/lib/queries/dashboard";
import { DriverDashboard } from "@/components/dashboard/driver-dashboard";

export default async function DriverDashboardPage() {
  const session = await requireDriver();
  const data = await getDriverDashboard(Number(session.user.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel główny</h1>
      <DriverDashboard data={data} />
    </div>
  );
}
