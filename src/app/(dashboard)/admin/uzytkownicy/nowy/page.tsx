import { requireAdmin } from "@/lib/auth-utils";
import { UserForm } from "@/components/users/user-form";

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <div className="max-w-2xl mx-auto">
      <UserForm />
    </div>
  );
}
