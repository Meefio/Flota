import { requireDriver } from "@/lib/auth-utils";
import { getDriverDocuments } from "@/lib/queries/drivers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeadlineBadge } from "@/components/vehicles/deadline-badge";
import {
  DRIVER_DOCUMENT_LABELS,
  EXPIRY_DOCUMENTS,
  AUTHORIZATION_DOCUMENTS,
} from "@/lib/constants";
import type { DriverDocumentType } from "@/db/schema";

export default async function DriverDocumentsPage() {
  const session = await requireDriver();
  const documents = await getDriverDocuments(Number(session.user.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Moje dokumenty</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumenty z terminem ważności</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {EXPIRY_DOCUMENTS.map((type) => {
              const doc = documents.find((d) => d.type === type);
              return (
                <div
                  key={type}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">
                    {DRIVER_DOCUMENT_LABELS[type]}
                  </span>
                  {doc?.expiresAt ? (
                    <DeadlineBadge expiresAt={doc.expiresAt} />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Nie ustawiono
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upoważnienia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {AUTHORIZATION_DOCUMENTS.map((type) => {
              const doc = documents.find((d) => d.type === type);
              return (
                <div
                  key={type}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm font-medium">
                    {DRIVER_DOCUMENT_LABELS[type]}
                  </span>
                  <Badge variant={doc?.isActive ? "default" : "secondary"}>
                    {doc?.isActive ? "Aktywne" : "Nieaktywne"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
