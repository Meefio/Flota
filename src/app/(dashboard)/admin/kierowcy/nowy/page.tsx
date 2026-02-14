import { requireAdmin } from "@/lib/auth-utils";
import { DriverForm } from "@/components/drivers/driver-form";

export default async function NewDriverPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl mx-auto">
      <DriverForm />
    </div>
  );
}
