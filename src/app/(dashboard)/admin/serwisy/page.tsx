import { requireAdmin } from "@/lib/auth-utils";
import { getAllServices } from "@/lib/queries/services";
import { getVehicles } from "@/lib/queries/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceFormGlobal } from "@/components/vehicles/service-form-global";
import { ServiceTable } from "@/components/vehicles/service-table";

export default async function ServicesPage() {
  await requireAdmin();

  const [services, allVehicles] = await Promise.all([
    getAllServices(),
    getVehicles(),
  ]);

  const totalCost = services.reduce(
    (sum, s) => sum + (s.cost ? Number(s.cost) : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Serwisy i naprawy</h1>
        <ServiceFormGlobal
          vehicles={allVehicles.map((v) => ({
            id: v.id,
            registrationNumber: v.registrationNumber,
          }))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Łączna liczba serwisów</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Łączne koszty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalCost.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pojazdów z serwisami</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {new Set(services.map((s) => s.vehicleId)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Brak wpisów serwisowych. Dodaj pierwszy serwis klikając przycisk powyżej.
          </CardContent>
        </Card>
      ) : (
        <ServiceTable services={services} />
      )}
    </div>
  );
}
