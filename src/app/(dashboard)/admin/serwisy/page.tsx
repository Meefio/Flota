import { requireAdmin } from "@/lib/auth-utils";
import { getAllServices } from "@/lib/queries/services";
import { getAllPlannedServices } from "@/lib/queries/planned-services";
import { getVehicles } from "@/lib/queries/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceFormGlobal } from "@/components/vehicles/service-form-global";
import { PlannedServiceFormGlobal } from "@/components/vehicles/planned-service-form-global";
import { ServiceTable } from "@/components/vehicles/service-table";
import { PlannedServiceTable } from "@/components/vehicles/planned-service-table";

export default async function ServicesPage() {
  await requireAdmin();

  const [services, plannedServices, allVehicles] = await Promise.all([
    getAllServices(),
    getAllPlannedServices(),
    getVehicles(),
  ]);

  const totalCost = services.reduce(
    (sum, s) => sum + (s.cost ? Number(s.cost) : 0),
    0
  );

  const vehiclesForSelect = allVehicles.map((v) => ({
    id: v.id,
    registrationNumber: v.registrationNumber,
    brand: v.brand,
    model: v.model,
  }));

  return (
    <div className="space-y-3 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Serwisy i naprawy</h1>
        <div className="flex gap-2">
          <PlannedServiceFormGlobal vehicles={vehiclesForSelect} />
          <ServiceFormGlobal vehicles={vehiclesForSelect} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-3">
        <Card className="py-3 gap-1 sm:py-6 sm:gap-6">
          <CardHeader className="pb-0 px-4 sm:px-6 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Łączna liczba serwisów</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0 sm:px-6 sm:pt-0">
            <p className="text-xl font-bold sm:text-2xl">{services.length}</p>
          </CardContent>
        </Card>
        <Card className="py-3 gap-1 sm:py-6 sm:gap-6">
          <CardHeader className="pb-0 px-4 sm:px-6 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Łączne koszty</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0 sm:px-6 sm:pt-0">
            <p className="text-xl font-bold tabular-nums sm:text-2xl">
              {totalCost.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
              })}
            </p>
          </CardContent>
        </Card>
        <Card className="py-3 gap-1 sm:py-6 sm:gap-6">
          <CardHeader className="pb-0 px-4 sm:px-6 sm:pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">Zaplanowane serwisy</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0 sm:px-6 sm:pt-0">
            <p className="text-xl font-bold sm:text-2xl">{plannedServices.length}</p>
          </CardContent>
        </Card>
      </div>

      {plannedServices.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base font-semibold sm:text-lg">Zaplanowane serwisy</h2>
          <PlannedServiceTable plannedServices={plannedServices} />
        </div>
      )}

      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-base font-semibold sm:text-lg">Historia serwisów</h2>
        {services.length === 0 ? (
          <Card className="py-6 sm:py-6">
            <CardContent className="py-8 text-center text-muted-foreground sm:py-12">
              Brak wpisów serwisowych. Dodaj pierwszy serwis klikając przycisk powyżej.
            </CardContent>
          </Card>
        ) : (
          <ServiceTable services={services} />
        )}
      </div>
    </div>
  );
}
