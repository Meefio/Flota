import { requireAdmin } from "@/lib/auth-utils";
import { getAdminDashboardStats } from "@/lib/queries/dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <AdminDashboard stats={stats} />
    </div>
  );
}
