import { requireAdmin } from "@/lib/auth-utils";
import {
  getAllDeadlinesForCalendar,
  PLANNED_SERVICE_COLOR,
} from "@/lib/queries/calendar";
import { DeadlineCalendar } from "@/components/calendar/deadline-calendar";

export default async function CalendarPage() {
  await requireAdmin();
  const events = await getAllDeadlinesForCalendar();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kalendarz terminów</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>OK (&gt;30 dni)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Uwaga (8-30 dni)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Pilne (&le;7 dni)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-900" />
          <span>Przeterminowane</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: PLANNED_SERVICE_COLOR }}
          />
          <span>Zaplanowany serwis</span>
        </div>
      </div>
      <DeadlineCalendar events={events} />
    </div>
  );
}
