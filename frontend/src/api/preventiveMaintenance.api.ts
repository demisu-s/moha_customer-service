import api from "./axios";
import { ApiResponse } from "./global.types";

/* ================= CREATE WORK ORDER ================= */

export const createPMWorkOrder = async (data: any) => {
  const response = await api.post<ApiResponse<any>>("/preventive-maintenance/", data);
  return response.data.data;
};

/* ================= GET ALL WORK ORDERS ================= */

export const getPMWorkOrders = async () => {
  const response = await api.get<ApiResponse<any[]>>("/preventive-maintenance/");
  return response.data.data;
};

/* ================= GET SINGLE WORK ORDER ================= */

export const getPMWorkOrderById = async (id: string) => {
  const response = await api.get<ApiResponse<any>>(`/preventive-maintenance/${id}`);
  return response.data.data;
};

/* ================= UPDATE STATUS ================= */

export const updatePMWorkOrderStatus = async (id: string, status: string) => {
  const response = await api.patch<ApiResponse<any>>(`/preventive-maintenance/${id}/status`, { status });
  return response.data.data;
};

/* ================= COMPLETE A TASK ================= */

export const completeTask = async (
  workOrderId: string,
  taskId: string,
  actualDuration?: number
) => {
  const response = await api.patch<ApiResponse<any>>(
    `/preventive-maintenance/${workOrderId}/tasks/${taskId}/complete`,
    { actualDuration }
  );
  return response.data.data;
};


/* ================= COMPLETE A PROCEDURE STEP ================= */

export const completeProcedureStep = async (
  workOrderId: string,
  taskId: string,
  stepNumber: number,
  notes?: string
) => {
  const response = await api.patch<ApiResponse<any>>(
    `/preventive-maintenance/${workOrderId}/tasks/${taskId}/procedures/complete`,
    { stepNumber, notes }
  );
  return response.data.data;
};

/* ================= DELETE WORK ORDER ================= */

export const deletePMWorkOrder = async (id: string) => {
  const response = await api.delete<ApiResponse<any>>(`/preventive-maintenance/${id}`);
  return response.data.data;
};