import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { getDriverById } from "@/lib/queries/drivers";
import { DriverForm } from "@/components/drivers/driver-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const driver = await getDriverById(Number(id));

  if (!driver) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/admin/kierowcy/${driver.id}`} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Powrót do szczegółów
        </Link>
      </Button>
      <DriverForm
        driver={{
          id: driver.id,
          email: driver.email,
          name: driver.name,
          pesel: driver.pesel ?? null,
        }}
      />
    </div>
  );
}
