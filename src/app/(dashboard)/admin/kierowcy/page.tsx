import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";
import { getDrivers } from "@/lib/queries/drivers";
import { DriverList } from "@/components/drivers/driver-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DriversPage() {
  await requireAdmin();
  const drivers = await getDrivers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kierowcy</h1>
        <Button asChild>
          <Link href="/admin/kierowcy/nowy">
            <Plus className="h-4 w-4 mr-2" />
            Nowy kierowca
          </Link>
        </Button>
      </div>
      <DriverList drivers={drivers} />
    </div>
  );
}
