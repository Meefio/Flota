"use client";

import { DEADLINE_TYPE_LABELS, DEADLINE_TYPES_FOR_VEHICLE } from "@/lib/constants";
import { DeadlineBadge } from "./deadline-badge";
import type { DeadlineType } from "@/db/schema";

interface Deadline {
  id: number;
  vehicleId: number;
  type: string;
  expiresAt: string;
}

interface DeadlineListProps {
  deadlines: Deadline[];
  vehicleId: number;
  vehicleType?: string;
}

export function DeadlineList({ deadlines, vehicleId, vehicleType = "truck" }: DeadlineListProps) {
  const deadlineTypes = DEADLINE_TYPES_FOR_VEHICLE[vehicleType] ?? DEADLINE_TYPES_FOR_VEHICLE.truck;

  return (
    <div className="space-y-3">
      {deadlineTypes.map((type) => {
        const deadline = deadlines.find((d) => d.type === type);
        return (
          <div
            key={type}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <span className="text-sm font-medium">
              {DEADLINE_TYPE_LABELS[type]}
            </span>
            {deadline ? (
              <DeadlineBadge expiresAt={deadline.expiresAt} />
            ) : (
              <span className="text-sm text-muted-foreground">
                Nie ustawiono
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
