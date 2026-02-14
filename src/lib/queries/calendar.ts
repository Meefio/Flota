import { db } from "@/db";
import { vehicleDeadlines, vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEADLINE_TYPE_LABELS } from "@/lib/constants";
import { getDeadlineStatus, DEADLINE_STATUS_CONFIG } from "@/lib/deadline-utils";
import type { DeadlineType } from "@/db/schema";

const STATUS_COLORS: Record<string, string> = {
  ok: "#22c55e",
  warning: "#eab308",
  urgent: "#ef4444",
  expired: "#991b1b",
};

export async function getAllDeadlinesForCalendar() {
  const result = await db
    .select({
      deadline: vehicleDeadlines,
      vehicleRegistration: vehicles.registrationNumber,
      vehicleType: vehicles.type,
    })
    .from(vehicleDeadlines)
    .innerJoin(vehicles, eq(vehicleDeadlines.vehicleId, vehicles.id))
    .where(eq(vehicles.isActive, true));

  return result.map((r) => {
    const status = getDeadlineStatus(r.deadline.expiresAt);
    return {
      id: String(r.deadline.id),
      title: `${r.vehicleRegistration} - ${DEADLINE_TYPE_LABELS[r.deadline.type as DeadlineType]}`,
      date: r.deadline.expiresAt,
      backgroundColor: STATUS_COLORS[status],
      borderColor: STATUS_COLORS[status],
      extendedProps: {
        vehicleId: r.deadline.vehicleId,
        deadlineType: r.deadline.type,
        status,
      },
    };
  });
}
