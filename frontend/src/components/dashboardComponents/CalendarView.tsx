import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarViewProps {
  events: { title: string; start: Date; end: Date }[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Navigation handlers
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

  // Change view type
  const handleViewChange = (newView: View) => setView(newView);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Top controls */}
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

      {/* Calendar component (hide built-in toolbar) */}
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
        toolbar={false} // ✅ hides the default toolbar
      />
    </div>
  );
};

export default CalendarView;
