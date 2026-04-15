import React from "react";
import EventForm from "../../components/dashboardComponents/EventForm";
import CalendarView from "../../components/dashboardComponents/CalendarView";
import * as Dialog from "@radix-ui/react-dialog";
import { useSchedule } from "../../context/ScheduleContext";
import { useUserContext } from "../../context/UserContext";

const Scheduler: React.FC = () => {
  const { events, addEvent, removeEvent, loading, refreshEvents } =
    useSchedule();

  const { currentUser } = useUserContext();

  /* ================= ROLE PERMISSIONS ================= */
  const canCreateEvent =
    currentUser?.role === "admin" ||
    currentUser?.role === "superadmin";

  /* ================= FILTER EVENTS ================= */
  const filteredEvents = React.useMemo(() => {
  if (!currentUser) return [];

  // SUPERADMIN → SEE ALL
  if (currentUser.role === "superadmin") {
    return events;
  }

  const userPlant =
    typeof currentUser.department?.plant === "string"
      ? currentUser.department?.plant
      : currentUser.department?.plant?._id;

  // ✅ FIXED FILTER
  return events.filter((e: any) => {
    const eventPlant =
      typeof e.plant === "string"
        ? e.plant
        : e.plant?._id;

    return eventPlant === userPlant;
  });

}, [events, currentUser]);

  /* ================= ADD EVENT ================= */
  const handleAddEvent = async (
    title: string,
    start: Date,
    end: Date,
    recurrence: string,
    cycles: number,
    plant: string
  ) => {
    const eventsToCreate: any[] = [];

    const baseStart = new Date(start);
    const baseEnd = new Date(end);

    // FIRST EVENT
    eventsToCreate.push({
      title,
      start: baseStart.toISOString(),
      end: baseEnd.toISOString(),
      plant,
    });

    // RECURRENCE
    if (recurrence !== "none") {
      for (let i = 1; i <= cycles; i++) {
        const nextStart = new Date(baseStart);
        const nextEnd = new Date(baseEnd);

        if (recurrence === "daily") {
          nextStart.setDate(baseStart.getDate() + i);
          nextEnd.setDate(baseEnd.getDate() + i);
        }

        if (recurrence === "weekly") {
          nextStart.setDate(baseStart.getDate() + i * 7);
          nextEnd.setDate(baseEnd.getDate() + i * 7);
        }

        if (recurrence === "monthly") {
          nextStart.setMonth(baseStart.getMonth() + i);
          nextEnd.setMonth(baseEnd.getMonth() + i);
        }

        eventsToCreate.push({
          title,
          start: nextStart.toISOString(),
          end: nextEnd.toISOString(),
          plant,
        });
      }
    }

    /* ✅ FIX: CREATE ONLY ONCE */
    for (const event of eventsToCreate) {
      await addEvent(event);
    }

    await refreshEvents();

    alert("Event created successfully 🎉");
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div className="px-2 space-y-1">
      <h1 className="text-2xl font-bold">Schedules</h1>

      <div className="flex justify-between items-center">
        <p className="text-lg text-black font-light">
          Manage your events and schedules here. Add new tasks and view them on
          the calendar.
        </p>

        {/* ✅ ONLY ADMIN & SUPERADMIN SEE BUTTON */}
        {canCreateEvent && (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="bg-primary-500 text-white shadow-lg font-bold px-4 py-1 rounded hover:bg-primary-900 transition">
                + Add Event
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 z-40" />

              <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50">
                <Dialog.Close asChild>
                  <button className="absolute top-1 right-3 text-gray-500 hover:text-gray-800 font-bold text-3xl">
                    &times;
                  </button>
                </Dialog.Close>

                <Dialog.Title className="text-2xl font-bold">
                  Plan Event
                </Dialog.Title>

                <EventForm onAddEvent={handleAddEvent} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </div>

      {/* ================= CALENDAR ================= */}
      <div className="md:col-span-2">
        <CalendarView
          events={filteredEvents}
          onDeleteEvent={removeEvent}
        />
      </div>
    </div>
  );
};

export default Scheduler;