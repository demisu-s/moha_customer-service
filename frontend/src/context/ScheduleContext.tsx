import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getScheduleEvents,
  createScheduleEvent,
  deleteScheduleEvent,
} from "../api/shcedule.api";

import { useUserContext } from "./UserContext";

interface Schedule {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  plant?: string;
}

type ScheduleContextType = {
  events: Schedule[];
  filteredEvents: Schedule[];
  loading: boolean;
  selectedPlant: string;
  setSelectedPlant: (plantId: string) => void;
  refreshEvents: () => Promise<void>;
  addEvent: (data: any) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
};

const ScheduleContext = createContext<ScheduleContextType | null>(null);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Schedule[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState("");

  const { currentUser } = useUserContext();

  /* ================= FETCH ================= */
  const refreshEvents = async () => {
    const data = await getScheduleEvents();

    const formatted = data.map((e: any) => ({
      ...e,
      start: new Date(e.start),
      end: new Date(e.end),
    }));

    setEvents(formatted);
    setLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  /* ================= FILTER BASED ON ROLE ================= */
  useEffect(() => {
    if (!currentUser) return;

    let filtered = events;

    if (currentUser.role === "admin") {
      filtered = events.filter(
        (e: any) => e.plant === currentUser?.department?.plant
      );
    }

    if (currentUser.role === "supervisor") {
      if (selectedPlant) {
        filtered = events.filter((e: any) => e.plant === selectedPlant);
      } else {
        filtered = [];
      }
    }

    // superadmin → sees all
    setFilteredEvents(filtered);
  }, [events, currentUser, selectedPlant]);

  /* ================= ADD ================= */
  const addEvent = async (data: any) => {
    const newEvent = await createScheduleEvent(data);

    const formatted = {
      ...newEvent,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end),
    };

    setEvents((prev) => [...prev, formatted]);
  };

  /* ================= DELETE ================= */
  const removeEvent = async (id: string) => {
    await deleteScheduleEvent(id);
    setEvents((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <ScheduleContext.Provider
      value={{
        events,
        filteredEvents,
        loading,
        selectedPlant,
        setSelectedPlant,
        refreshEvents,
        addEvent,
        removeEvent,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error("useSchedule must be used inside ScheduleProvider");
  return ctx;
};