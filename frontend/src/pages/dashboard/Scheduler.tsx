import React, { useState, useEffect } from "react";
import EventForm from "../../components/dashboardComponents/EventForm";
import CalendarView from "../../components/dashboardComponents/CalendarView";
import * as Dialog from "@radix-ui/react-dialog";

const Scheduler: React.FC = () => {
  const [events, setEvents] = useState<
    { title: string; start: Date; end: Date }[]
  >([]);

    useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) {
      setEvents(JSON.parse(stored).map((e: any) => ({
        ...e,
        start: new Date(e.start),
        end: new Date(e.end),
      })));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (title: string, date: Date) => {
    setEvents([...events, { title, start: date, end: date }]);
  };

  return (
    <div className="px-2 space-y-1">
      {/* Header */}
      <h1 className="text-2xl font-bold">Schedules</h1>
      <div className="flex justify-between items-center">
        <p className="text-lg text-black font-light">
          Manage your events and schedules here. Add new tasks and view them on the calendar.
        </p>

        {/* Dialog Trigger */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="bg-primary-500 text-white shadow-lg font-bold px-4 py-1 rounded hover:bg-primary-900 transition">
              + Add Event
            </button>
          </Dialog.Trigger>

          {/* Dialog Content */}
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50">
                <Dialog.Close asChild>
                    <button className="absolute top-1 right-3 text-gray-500 hover:text-gray-800 font-bold text-3xl">
                    &times;
                    </button>
                </Dialog.Close>
              <Dialog.Title className="text-2xl font-bold ">Plan Event</Dialog.Title>
              <EventForm onAddEvent={handleAddEvent} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Calendar */}
      <div className="md:col-span-2">
        <CalendarView events={events} />
      </div>
    </div>
  );
};

export default Scheduler;
