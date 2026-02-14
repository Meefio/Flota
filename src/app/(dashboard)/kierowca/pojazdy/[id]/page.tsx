import { notFound } from "next/navigation";
import { requireDriverOwnership } from "@/lib/auth-utils";
import { getVehicleWithDetails } from "@/lib/queries/vehicles";
import { getDeadlineHistory } from "@/lib/queries/deadlines";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { DeadlineList } from "@/components/vehicles/deadline-list";
import { OperationForm } from "@/components/vehicles/operation-form";
import { OperationHistory } from "@/components/vehicles/operation-history";

export default async function DriverVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicleId = Number(id);
  await requireDriverOwnership(vehicleId);

  const vehicle = await getVehicleWithDetails(vehicleId);
  if (!vehicle) notFound();

  const history = await getDeadlineHistory(vehicleId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{vehicle.registrationNumber}</h1>
          <p className="text-muted-foreground">
            {vehicle.brand} {vehicle.model}{" "}
            <Badge variant="outline">{VEHICLE_TYPE_LABELS[vehicle.type]}</Badge>
          </p>
        </div>
        <OperationForm vehicleId={vehicleId} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terminy</CardTitle>
          </CardHeader>
          <CardContent>
            <DeadlineList deadlines={vehicle.deadlines} vehicleId={vehicleId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historia operacji</CardTitle>
          </CardHeader>
          <CardContent>
            <OperationHistory operations={history} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
