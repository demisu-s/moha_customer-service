import api from "./axios";
import {
  ApiResponse,
  CreateServiceRequestPayload,
} from "./global.types";

/* ================= CREATE REQUEST ================= */

export const createServiceRequest = async (requestData: CreateServiceRequestPayload) => {
  const response = await api.post<ApiResponse<any>>(
    "/request/createRequest",
    {
      description: requestData.description,
      problemCategory: requestData.problemCategory,
      requestedDate: requestData.requestedDate,
      attachments: requestData.attachments || [],
      issues: requestData.issues,
     deviceId: requestData.deviceId,
    }
  );

  return response.data.data;
};
/* ================= GET ALL REQUESTS ================= */

export const getServiceRequests = async () => {
  const response = await api.get<ApiResponse<any[]>>(
    "/request/getRequests"
  );

  return response.data.data;
};

/* ================= UPDATE REQUEST ================= */

export const updateServiceRequest = async (
  id: string,
  data: any
) => {
  const response = await api.put<ApiResponse<any>>(
    `/request/updateRequestById/${id}`,
    data
  );

  return response.data.data;
};

/* ================= ASSIGN SUPERVISOR ================= */

export const assignSupervisor = async (
  id: string,
  supervisorId: string
) => {
  const response = await api.put<ApiResponse<any>>(
    `/request/assign/assignedSupervisor/${id}`,
    { supervisorId }
  );

  return response.data.data;
};

/* ================= RESOLVE REQUEST ================= */

export const resolveServiceRequest = async (id: string) => {
  const response = await api.put<ApiResponse<any>>(
    `/request/resolve/${id}`
  );

  return response.data.data;
};

/* ================= GET REQUEST BY ID ================= */

export const getServiceRequestById = async (id: string) => {
  const response = await api.get<ApiResponse<any>>(
    `/request/getRequestById/${id}`
  );

  return response.data.data;
};