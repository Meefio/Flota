import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/sonner";
import { getExpiringDeadlines } from "@/lib/queries/deadlines";
import { getRecentAuditLogsForAdmin } from "@/lib/queries/audit";
import { getDriverAssignedTasks } from "@/lib/queries/notes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let urgentCount = 0;
  let recentAuditLogs: Awaited<ReturnType<typeof getRecentAuditLogsForAdmin>> =
    [];
  let driverTasks: Awaited<ReturnType<typeof getDriverAssignedTasks>> = [];

  if (session.user.role === "admin") {
    const [urgent, audit] = await Promise.all([
      getExpiringDeadlines(7),
      getRecentAuditLogsForAdmin(15),
    ]);
    urgentCount = urgent.length;
    recentAuditLogs = audit;
  } else if (session.user.role === "driver") {
    driverTasks = await getDriverAssignedTasks(Number(session.user.id));
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={session.user.name}
          role={session.user.role}
          urgentCount={urgentCount}
          recentAuditLogs={recentAuditLogs}
          driverTasks={driverTasks}
        />
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
