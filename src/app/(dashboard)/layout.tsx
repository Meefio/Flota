import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Toaster } from "@/components/ui/sonner";
import { getExpiringDeadlines } from "@/lib/queries/deadlines";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let urgentCount = 0;
  if (session.user.role === "admin") {
    const urgent = await getExpiringDeadlines(7);
    urgentCount = urgent.length;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <Sidebar role={session.user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={session.user.name}
          role={session.user.role}
          urgentCount={urgentCount}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
