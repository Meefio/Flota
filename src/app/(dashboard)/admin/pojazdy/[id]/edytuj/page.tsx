import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";
import { getVehicleById } from "@/lib/queries/vehicles";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const vehicle = await getVehicleById(Number(id));

  if (!vehicle) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
