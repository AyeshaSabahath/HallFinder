"use client";

import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import type { AvailabilityStatus } from "@prisma/client";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface AvailabilityItem {
  date: Date | string;
  status: AvailabilityStatus;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  status: AvailabilityStatus;
}

const statusColors: Record<AvailabilityStatus, string> = {
  AVAILABLE: "#10b981",
  BOOKED: "#ef4444",
  MAINTENANCE: "#f59e0b",
};

export function AvailabilityCalendar({
  availability,
}: {
  availability: AvailabilityItem[];
}) {
  const events: CalendarEvent[] = useMemo(
    () =>
      availability.map((a) => {
        const date = new Date(a.date);
        return {
          title: a.status.charAt(0) + a.status.slice(1).toLowerCase(),
          start: date,
          end: date,
          status: a.status,
        };
      }),
    [availability]
  );

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: statusColors[event.status],
      borderRadius: "6px",
      border: "none",
      color: "white",
      fontSize: "12px",
    },
  });

  return (
    <div className="h-[400px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month"] as View[]}
        defaultView="month"
        eventPropGetter={eventStyleGetter}
        popup
      />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Legend color="#10b981" label="Available" />
        <Legend color="#ef4444" label="Booked" />
        <Legend color="#f59e0b" label="Maintenance" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
