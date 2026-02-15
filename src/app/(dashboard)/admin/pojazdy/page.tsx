import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";
import { getVehicles } from "@/lib/queries/vehicles";
import { VehicleList } from "@/components/vehicles/vehicle-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export default async function VehiclesPage() {
  await requireAdmin();

  const [trucks, trailers, buses, others] = await Promise.all([
    getVehicles("truck"),
    getVehicles("trailer"),
    getVehicles("bus"),
    getVehicles("other"),
  ]);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Pojazdy</h1>
        <Button asChild>
          <Link href="/admin/pojazdy/nowy">
            <Plus className="h-4 w-4 mr-2" />
            Nowy pojazd
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="trucks" className="min-w-0">
        <div className="overflow-x-auto [-webkit-overflow-scrolling:touch] pb-1">
          <TabsList className="w-max min-w-0">
            <TabsTrigger value="trucks">Ciągniki ({trucks.length})</TabsTrigger>
            <TabsTrigger value="trailers">Naczepy ({trailers.length})</TabsTrigger>
            <TabsTrigger value="buses">Busy ({buses.length})</TabsTrigger>
            <TabsTrigger value="others">Pozostałe ({others.length})</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="trucks">
          <VehicleList vehicles={trucks} />
        </TabsContent>
        <TabsContent value="trailers">
          <VehicleList vehicles={trailers} />
        </TabsContent>
        <TabsContent value="buses">
          <VehicleList vehicles={buses} />
        </TabsContent>
        <TabsContent value="others">
          <VehicleList vehicles={others} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
