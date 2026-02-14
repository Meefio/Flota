import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { getDriverWithDocuments } from "@/lib/queries/drivers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverDocuments } from "@/components/drivers/driver-documents";
import { Pencil } from "lucide-react";

export default async function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const driver = await getDriverWithDocuments(Number(id));

  if (!driver) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{driver.name}</h1>
          <p className="text-muted-foreground">{driver.email}</p>
          {driver.pesel && (
            <p className="text-muted-foreground text-sm">PESEL: {driver.pesel}</p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href={`/admin/kierowcy/${driver.id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edytuj
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dokumenty i upoważnienia</CardTitle>
        </CardHeader>
        <CardContent>
          <DriverDocuments userId={driver.id} documents={driver.documents} />
        </CardContent>
      </Card>
    </div>
  );
}
