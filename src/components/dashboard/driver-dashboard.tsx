import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import { DEADLINE_TYPE_LABELS, DRIVER_DOCUMENT_LABELS, DEADLINE_TYPES_FOR_VEHICLE } from "@/lib/constants";
import { VEHICLE_TYPE_LABELS } from "@/lib/constants";
import type { DeadlineType, DriverDocumentType } from "@/db/schema";
import { Eye } from "lucide-react";

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
          {data.vehicles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak przypisanych pojazdów
            </p>
          ) : (
            <div className="space-y-4">
              {data.vehicles.map((v) => (
                <div key={v.vehicleId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{v.registrationNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {v.brand} {v.model}
                        <Badge variant="outline" className="ml-2">
                          {VEHICLE_TYPE_LABELS[v.type]}
                        </Badge>
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/kierowca/pojazdy/${v.vehicleId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Szczegóły
                      </Link>
                    </Button>
                  </div>
                  {v.deadlines.length > 0 && (
                    <div className="space-y-1">
                      {v.deadlines.filter((d) => (DEADLINE_TYPES_FOR_VEHICLE[v.type] ?? DEADLINE_TYPES_FOR_VEHICLE.truck).includes(d.type as DeadlineType)).map((d) => (
                        <div
                          key={d.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {DEADLINE_TYPE_LABELS[d.type as DeadlineType]}
                          </span>
                          <DeadlineBadge expiresAt={d.expiresAt} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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
