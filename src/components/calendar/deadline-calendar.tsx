"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    vehicleId: number;
    deadlineType: string;
    status: string;
  };
}

export function DeadlineCalendar({ events }: { events: CalendarEvent[] }) {
  const router = useRouter();

  return (
    <div className="bg-card rounded-lg border p-4">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="pl"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        buttonText={{
          today: "Dziś",
          month: "Miesiąc",
          week: "Tydzień",
        }}
        eventClick={(info) => {
          const vehicleId = info.event.extendedProps.vehicleId;
          router.push(`/admin/pojazdy/${vehicleId}`);
        }}
        height="auto"
        dayMaxEvents={3}
        eventDisplay="block"
        eventTextColor="#fff"
      />
    </div>
  );
}
