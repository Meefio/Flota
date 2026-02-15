import { requireAdmin } from "@/lib/auth-utils";
import { ProfileForm } from "@/components/profile/profile-form";
import { ChangePasswordForm } from "@/components/profile/change-password-form";

export default async function AdminProfilePage() {
  const session = await requireAdmin();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profil</h1>
      <ProfileForm initialName={session.user.name ?? ""} />
      <ChangePasswordForm />
    </div>
  );
}
