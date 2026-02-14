import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";
import { getVehicles } from "@/lib/queries/vehicles";
import { VehicleList } from "@/components/vehicles/vehicle-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default async function VehiclesPage() {
  await requireAdmin();

  const [trucks, trailers] = await Promise.all([
    getVehicles("truck"),
    getVehicles("trailer"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pojazdy</h1>
        <Button asChild>
          <Link href="/admin/pojazdy/nowy">
            <Plus className="h-4 w-4 mr-2" />
            Nowy pojazd
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="trucks">
        <TabsList>
          <TabsTrigger value="trucks">Ciągniki ({trucks.length})</TabsTrigger>
          <TabsTrigger value="trailers">Naczepy ({trailers.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="trucks">
          <VehicleList vehicles={trucks} />
        </TabsContent>
        <TabsContent value="trailers">
          <VehicleList vehicles={trailers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
