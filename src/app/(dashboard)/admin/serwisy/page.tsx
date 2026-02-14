import { requireAdmin } from "@/lib/auth-utils";
import { getAllServices } from "@/lib/queries/services";
import { getVehicles } from "@/lib/queries/vehicles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import { ServiceFormGlobal } from "@/components/vehicles/service-form-global";
import type { ServiceType } from "@/db/schema";
import Link from "next/link";

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
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        {SERVICE_TYPE_LABELS[service.type as ServiceType] ?? service.type}
                      </Badge>
                      <span className="text-sm font-medium">{service.description}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <Link
                        href={`/admin/pojazdy/${service.vehicleId}`}
                        className="hover:underline font-medium text-foreground"
                      >
                        {service.registrationNumber} — {service.vehicleBrand} {service.vehicleModel}
                      </Link>
                      <span>
                        Data: {new Date(service.performedAt).toLocaleDateString("pl-PL")}
                      </span>
                      {service.mileage && (
                        <span>Przebieg: {service.mileage.toLocaleString("pl-PL")} km</span>
                      )}
                      {service.workshop && <span>Warsztat: {service.workshop}</span>}
                      <span>Dodał: {service.createdByName}</span>
                    </div>
                    {service.notes && (
                      <p className="text-xs text-muted-foreground">{service.notes}</p>
                    )}
                  </div>
                  {service.cost && (
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {Number(service.cost).toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
