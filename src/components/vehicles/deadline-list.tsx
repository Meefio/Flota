"use client";

import { DEADLINE_TYPE_LABELS } from "@/lib/constants";
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
}

const ALL_DEADLINE_TYPES: DeadlineType[] = [
  "przeglad",
  "ubezpieczenie",
  "tachograf",
  "winda_udt",
];

export function DeadlineList({ deadlines, vehicleId }: DeadlineListProps) {
  return (
    <div className="space-y-3">
      {ALL_DEADLINE_TYPES.map((type) => {
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
