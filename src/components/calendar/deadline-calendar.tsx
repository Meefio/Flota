"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import "./calendar-styles.css";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    vehicleId: number;
    kind?: "deadline" | "planned_service";
    deadlineType?: string;
    status?: string;
    serviceType?: string;
  };
}

export function DeadlineCalendar({ events }: { events: CalendarEvent[] }) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-lg border p-4 fc-modern">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="pl"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        buttonText={{
          today: "Dziś",
          month: "Miesiąc",
        }}
        eventClick={(info) => {
          const vehicleId = info.event.extendedProps.vehicleId;
          router.push(`/admin/pojazdy/${vehicleId}`);
        }}
        eventClassNames={["cursor-pointer"]}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventTextColor="#fff"
      />
    </div>
  );
}
