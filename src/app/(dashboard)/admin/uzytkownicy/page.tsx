import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";
import { getAllUsers } from "@/lib/queries/users";
import { UserList } from "@/components/users/user-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function UsersPage() {
  await requireAdmin();
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Użytkownicy</h1>
        <Button asChild>
          <Link href="/admin/uzytkownicy/nowy">
            <Plus className="h-4 w-4 mr-2" />
            Dodaj użytkownika
          </Link>
        </Button>
      </div>
      <UserList users={users} />
    </div>
  );
}
