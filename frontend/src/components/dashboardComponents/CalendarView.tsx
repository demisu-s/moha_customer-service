import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useUserContext } from "../../context/UserContext";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

/* ================= TYPES ================= */
interface EventType {
  _id: string;
  title: string;
  start: any;
  end: any;
  plant?: any; // ✅ added plant
}

interface CalendarViewProps {
  events: EventType[];
  onDeleteEvent?: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onDeleteEvent,
}) => {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
const { currentUser } = useUserContext();


  /* ================= NAVIGATION ================= */
  const handleToday = () => setCurrentDate(new Date());

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") newDate.setMonth(prev.getMonth() + 1);
      else if (view === "week") newDate.setDate(prev.getDate() + 7);
      else if (view === "day") newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  };

  const handleBack = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (view === "month") newDate.setMonth(prev.getMonth() - 1);
      else if (view === "week") newDate.setDate(prev.getDate() - 7);
      else if (view === "day") newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  };

  const handleViewChange = (newView: View) => setView(newView);

  /* ================= DELETE ================= */
const handleSelectEvent = (event: EventType) => {
  if (!onDeleteEvent) return;

  // ❌ BLOCK supervisor
  if (currentUser?.role === "supervisor") {
    alert("You are not allowed to delete schedules");
    return;
  }

  // optional: only admin + superadmin can delete
  if (
    currentUser?.role !== "admin" &&
    currentUser?.role !== "superadmin"
  ) {
    alert("Permission denied");
    return;
  }

  if (window.confirm(`Delete "${event.title}" event?`)) {
    onDeleteEvent(event._id);
  }
};
  /* ================= SAFE DATE FORMAT ================= */
  const safeFormat = (value: any, pattern: string) => {
    const date = new Date(value);
    if (!value || isNaN(date.getTime())) return "--";
    return format(date, pattern);
  };

  /* ================= CUSTOM AGENDA TABLE ================= */
  const CustomAgenda = ({ events }: { events: EventType[] }) => {
    return (
      <div className="bg-white mt-4 rounded-lg overflow-hidden border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Start Time</th>
              <th className="text-left p-3">End Time</th>
              <th className="text-left p-3">Event</th>
              <th className="text-left p-3">Plant</th> {/* ✅ NEW */}
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => {
                const start = new Date(event.start);
                const end = new Date(event.end);

                // ✅ Handle both object and string
                const plantName =
                  typeof event.plant === "object"
                    ? event.plant?.name
                    : event.plant || "--";

                return (
                  <tr
                    key={event._id}
                    onClick={() => handleSelectEvent(event)}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3">
                      {safeFormat(start, "MMM dd, yyyy")}
                    </td>

                    <td className="p-3">
                      {safeFormat(start, "HH:mm")}
                    </td>

                    <td className="p-3">
                      {safeFormat(end, "HH:mm")}
                    </td>

                    <td className="p-3 font-medium">
                      {event.title}
                    </td>

                    <td className="p-3">
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs">
                        {plantName}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* ================= TOP CONTROLS ================= */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            onClick={handleToday}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-semibold text-lg">
            {format(currentDate, "MMMM yyyy")}
          </span>

          <div className="flex gap-2">
            {["month", "week", "day", "agenda"].map((v) => (
              <button
                key={v}
                onClick={() => handleViewChange(v as View)}
                className={`px-3 py-1 rounded transition ${
                  view === v
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= VIEW SWITCH ================= */}
      {view === "agenda" ? (
        <CustomAgenda events={events} />
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={view}
          onView={(newView) => setView(newView)}
          views={["month", "week", "day", "agenda"]}
          style={{ height: 600 }}
          toolbar={false}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;