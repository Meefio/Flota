import { requireAdmin } from "@/lib/auth-utils";
import { VehicleForm } from "@/components/vehicles/vehicle-form";

export default async function NewVehiclePage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl mx-auto">
      <VehicleForm />
    </div>
  );
}
