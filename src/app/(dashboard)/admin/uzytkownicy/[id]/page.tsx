import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-utils";
import { getUserById } from "@/lib/queries/users";
import { UserForm } from "@/components/users/user-form";
import { SetUserActiveButton } from "@/components/users/set-user-active-button";
import { ResetUserPasswordButton } from "@/components/users/reset-user-password-button";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const session = await auth();
  const currentUserId = session?.user?.id ? Number(session.user.id) : 0;

  const { id } = await params;
  const user = await getUserById(Number(id));

  if (!user) notFound();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Edycja użytkownika</h1>
        <div className="flex gap-2">
          <ResetUserPasswordButton userId={user.id} />
          <SetUserActiveButton
            userId={user.id}
            isActive={user.isActive}
            currentUserId={currentUserId}
          />
        </div>
      </div>
      <UserForm
        user={{
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }}
      />
    </div>
  );
}
