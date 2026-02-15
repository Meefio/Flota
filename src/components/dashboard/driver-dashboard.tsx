import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import { DRIVER_DOCUMENT_LABELS } from "@/lib/constants";
import type { DriverDocumentType } from "@/db/schema";
import { DriverVehicleList } from "./driver-vehicle-list";

interface DriverDashboardProps {
  data: {
    vehicles: {
      vehicleId: number;
      registrationNumber: string;
      brand: string;
      model: string;
      type: string;
      deadlines: { id: number; type: string; expiresAt: string }[];
    }[];
    documents: {
      id: number;
      type: string;
      expiresAt: string | null;
      isActive: boolean;
    }[];
  };
}

export function DriverDashboard({ data }: DriverDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Moje pojazdy</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverVehicleList vehicles={data.vehicles} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moje dokumenty</CardTitle>
        </CardHeader>
        <CardContent>
          {data.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak dokumentów</p>
          ) : (
            <div className="space-y-2">
              {data.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm">
                    {DRIVER_DOCUMENT_LABELS[doc.type as DriverDocumentType]}
                  </span>
                  {doc.expiresAt ? (
                    <DeadlineBadge expiresAt={doc.expiresAt} />
                  ) : (
                    <Badge variant={doc.isActive ? "default" : "secondary"}>
                      {doc.isActive ? "Aktywne" : "Nieaktywne"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
