import api from "./axios";
import {
  ApiResponse,
  CreateServiceRequestPayload,
} from "./global.types";

/* ================= CREATE REQUEST ================= */

export const createServiceRequest = async (
  requestData: CreateServiceRequestPayload
) => {
  const formData = new FormData();

  formData.append(
    "description",
    requestData.description
  );

  formData.append(
    "problemCategory",
    requestData.problemCategory
  );

  formData.append(
    "deviceId",
    requestData.deviceId
  );

  if (requestData.requestedDate) {
    formData.append(
      "requestedDate",
      requestData.requestedDate
    );
  }

  requestData.attachments?.forEach((file) => {
    formData.append("attachments", file);
  });

  const response = await api.post(
    "/request/createRequest",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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


export const assignRequest = async (id: string, data: any) => {
  const response = await api.put<ApiResponse<any>>(
    `/request/assign/assignedSupervisor/${id}`,
    data
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