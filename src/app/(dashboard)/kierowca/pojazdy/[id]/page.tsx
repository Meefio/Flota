import { notFound } from "next/navigation";
import { requireDriverOwnership } from "@/lib/auth-utils";
import { getVehicleWithDetails } from "@/lib/queries/vehicles";
import { getDeadlineHistory } from "@/lib/queries/deadlines";
import { getVehicleNotes } from "@/lib/queries/notes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { DeadlineList } from "@/components/vehicles/deadline-list";
import { OperationForm } from "@/components/vehicles/operation-form";
import { OperationHistory } from "@/components/vehicles/operation-history";
import { VehicleNotes } from "@/components/vehicles/vehicle-notes";

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

  const [history, notes] = await Promise.all([
    getDeadlineHistory(vehicleId),
    getVehicleNotes(vehicleId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{vehicle.registrationNumber}</h1>
          <p className="text-muted-foreground">
            {vehicle.brand} {vehicle.model}{" "}
            {vehicle.year ? `(${vehicle.year})` : ""}
          </p>
        </div>
        <OperationForm vehicleId={vehicleId} vehicleType={vehicle.type} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informacje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Typ</span>
              <Badge variant="outline">
                {VEHICLE_TYPE_LABELS[vehicle.type]}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marka</span>
              <span>{vehicle.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model</span>
              <span>{vehicle.model}</span>
            </div>
            {vehicle.vin && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">VIN</span>
                <span className="font-mono text-sm uppercase">{vehicle.vin}</span>
              </div>
            )}
            {vehicle.year && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rok</span>
                <span>{vehicle.year}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terminy</CardTitle>
          </CardHeader>
          <CardContent>
            <DeadlineList deadlines={vehicle.deadlines} vehicleId={vehicleId} vehicleType={vehicle.type} />
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Adnotacje / czynności do wykonania</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleNotes vehicleId={vehicleId} notes={notes} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
