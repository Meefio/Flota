import { requireDriver } from "@/lib/auth-utils";
import { getDriverDashboard } from "@/lib/queries/dashboard";
import { DriverVehicleList } from "@/components/dashboard/driver-vehicle-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DriverVehiclesPage() {
  const session = await requireDriver();
  const data = await getDriverDashboard(Number(session.user.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moje pojazdy</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pojazdy</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverVehicleList vehicles={data.vehicles} />
        </CardContent>
      </Card>
    </div>
  );
}
