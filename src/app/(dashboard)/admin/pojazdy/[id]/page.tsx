import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { getVehicleWithDetails } from "@/lib/queries/vehicles";
import { getDeadlineHistory } from "@/lib/queries/deadlines";
import { getDrivers } from "@/lib/queries/drivers";
import { getVehicleServices } from "@/lib/queries/services";
import { getPlannedServicesByVehicle } from "@/lib/queries/planned-services";
import { getVehicleNotes } from "@/lib/queries/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import { DeadlineList } from "@/components/vehicles/deadline-list";
import { DeleteVehicleButton } from "@/components/vehicles/delete-vehicle-button";
import { OperationForm } from "@/components/vehicles/operation-form";
import { OperationHistory } from "@/components/vehicles/operation-history";
import { AssignmentManager } from "@/components/vehicles/assignment-manager";
import { ServiceForm } from "@/components/vehicles/service-form";
import { ServiceList } from "@/components/vehicles/service-list";
import { PlannedServiceList } from "@/components/vehicles/planned-service-list";
import { VehicleNotes } from "@/components/vehicles/vehicle-notes";
import { Pencil } from "lucide-react";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const vehicleId = Number(id);

  const [vehicle, history, drivers, services, plannedServices, notes] =
    await Promise.all([
      getVehicleWithDetails(vehicleId),
      getDeadlineHistory(vehicleId),
      getDrivers(),
      getVehicleServices(vehicleId),
      getPlannedServicesByVehicle(vehicleId),
      getVehicleNotes(vehicleId),
    ]);

  if (!vehicle) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">{vehicle.registrationNumber}</h1>
          <p className="text-muted-foreground">
            {vehicle.brand} {vehicle.model}{" "}
            {vehicle.year ? `(${vehicle.year})` : ""}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <OperationForm vehicleId={vehicleId} vehicleType={vehicle.type} />
          <ServiceForm vehicleId={vehicleId} />
          <Button asChild variant="outline">
            <Link href={`/admin/pojazdy/${vehicle.id}/edytuj`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edytuj
            </Link>
          </Button>
          <DeleteVehicleButton vehicleId={vehicle.id} />
        </div>
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
            {vehicle.notes && (
              <div>
                <span className="text-muted-foreground text-sm">Notatki</span>
                <p className="text-sm mt-1">{vehicle.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terminy</CardTitle>
          </CardHeader>
          <CardContent>
            <DeadlineList
              deadlines={vehicle.deadlines}
              vehicleId={vehicle.id}
              vehicleType={vehicle.type}
            />
          </CardContent>
        </Card>

        <AssignmentManager
          vehicleId={vehicleId}
          currentAssignments={vehicle.currentAssignments}
          drivers={drivers}
        />

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
            <CardTitle className="text-lg">Serwisy i naprawy</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceList services={services} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Zaplanowane serwisy</CardTitle>
          </CardHeader>
          <CardContent>
            <PlannedServiceList
              vehicleId={vehicleId}
              plannedServices={plannedServices}
            />
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
