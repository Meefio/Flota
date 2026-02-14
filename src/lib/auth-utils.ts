import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { vehicleAssignments } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== "admin") {
    redirect("/kierowca");
  }
  return session;
}

export async function requireDriver() {
  const session = await requireAuth();
  if (session.user.role !== "driver") {
    redirect("/admin");
  }
  return session;
}

export async function requireDriverOwnership(vehicleId: number) {
  const session = await requireAuth();
  if (session.user.role === "admin") return session;

  const [assignment] = await db
    .select()
    .from(vehicleAssignments)
    .where(
      and(
        eq(vehicleAssignments.vehicleId, vehicleId),
        eq(vehicleAssignments.userId, Number(session.user.id)),
        isNull(vehicleAssignments.assignedTo)
      )
    )
    .limit(1);

  if (!assignment) {
    redirect("/kierowca");
  }
  return session;
}
