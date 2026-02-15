import { requireDriver } from "@/lib/auth-utils";
import { getDriverCurrentVehicles } from "@/lib/queries/assignments";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { DriverAssignedVehiclesCard } from "@/components/dashboard/driver-assigned-vehicles-card";

export default async function DriverProfilePage() {
  const session = await requireDriver();
  const assignedVehicles = await getDriverCurrentVehicles(Number(session.user.id));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profil</h1>
      <DriverAssignedVehiclesCard vehicles={assignedVehicles} />
      <ProfileForm initialName={session.user.name ?? ""} />
      <ChangePasswordForm />
    </div>
  );
}
