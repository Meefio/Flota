import { db } from "@/db";
import { vehicleDeadlines, vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DEADLINE_TYPE_LABELS, SERVICE_TYPE_LABELS } from "@/lib/constants";
import { getDeadlineStatus } from "@/lib/deadline-utils";
import { getAllPlannedServicesForCalendar } from "@/lib/queries/planned-services";
import type { DeadlineType, ServiceType } from "@/db/schema";

const STATUS_COLORS: Record<string, string> = {
  ok: "#22c55e",
  warning: "#eab308",
  urgent: "#ef4444",
  expired: "#991b1b",
};

export const PLANNED_SERVICE_COLOR = "#3b82f6";

export async function getAllDeadlinesForCalendar() {
  const [deadlineRows, plannedList] = await Promise.all([
    db
      .select({
        deadline: vehicleDeadlines,
        vehicleRegistration: vehicles.registrationNumber,
        vehicleType: vehicles.type,
      })
      .from(vehicleDeadlines)
      .innerJoin(vehicles, eq(vehicleDeadlines.vehicleId, vehicles.id))
      .where(eq(vehicles.isActive, true)),
    getAllPlannedServicesForCalendar(),
  ]);

  const deadlineEvents = deadlineRows.map((r) => {
    const status = getDeadlineStatus(r.deadline.expiresAt);
    return {
      id: String(r.deadline.id),
      title: `${r.vehicleRegistration} - ${DEADLINE_TYPE_LABELS[r.deadline.type as DeadlineType]}`,
      date: r.deadline.expiresAt,
      backgroundColor: STATUS_COLORS[status],
      borderColor: STATUS_COLORS[status],
      extendedProps: {
        vehicleId: r.deadline.vehicleId,
        kind: "deadline" as const,
        deadlineType: r.deadline.type,
        status,
      },
    };
  });

  const plannedEvents = plannedList.map((p) => ({
    id: `planned-${p.id}`,
    title: `${p.registrationNumber} - ${SERVICE_TYPE_LABELS[p.type as ServiceType]} (plan.)`,
    date: p.plannedDate,
    backgroundColor: PLANNED_SERVICE_COLOR,
    borderColor: PLANNED_SERVICE_COLOR,
    extendedProps: {
      vehicleId: p.vehicleId,
      kind: "planned_service" as const,
      serviceType: p.type,
    },
  }));

  return [...deadlineEvents, ...plannedEvents];
}
