import api from "./axios";
import { ApiResponse, CreateSchedulePayload } from "./global.types";

/* ================= CREATE EVENT ================= */

export const createScheduleEvent = async (data: CreateSchedulePayload) => {
  const response = await api.post<ApiResponse<any>>("/schedule", {
    title: data.title,
    start: data.start,
    end: data.end,
    plant: data.plant, // ✅ ADD THIS
    recurrence: data.recurrence || "none",
    cycles: data.cycles || 1,
  });

  return response.data.data;
};


/* ================= GET EVENTS ================= */

export const getScheduleEvents = async () => {
  const response = await api.get<ApiResponse<any[]>>(
    "/schedule"
  );

  return response.data.data;
};

/* ================= DELETE EVENT ================= */

export const deleteScheduleEvent = async (id: string) => {
  const response = await api.delete<ApiResponse<any>>(
    `/schedule/${id}`
  );

  return response.data.data;
};