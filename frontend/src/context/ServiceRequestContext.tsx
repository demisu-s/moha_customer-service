import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getServiceRequests,
  createServiceRequest as apiCreateRequest,
  updateServiceRequest,
} from "../api/request.api";

export type Urgency = "Low" | "Medium" | "High" | "";
export type RequestStatus = "Pending" | "Assigned" | "Resolved" | "Unresolved";
export type ProblemCategory = "Hardware" | "Software" | "Network" | "Other";
export type Issues =
  | "HardDisk Failure"
  | "Windows Corruption"
  | "Virus"
  | "Windows Activation"
  | "Jet Report"
  | "Office Activation"
  | "Other";

export const PROBLEM_TYPES: Issues[] = [
  "HardDisk Failure",
  "Windows Corruption",
  "Virus",
  "Windows Activation",
  "Jet Report",
  "Office Activation",
  "Other",
];

export const PROBLEM_CATEGORY: ProblemCategory[] = [
  "Hardware",
  "Software",
  "Network",
  "Other",
];

export interface ServiceRequest {
  id: string;
  deviceId: string;
  serialNumber: string;
  requestedBy: string;
  description: string;
  plant: string;
  department: string;
  createdAt: string;
  deviceImage?: string;
  deviceName?: string;
  deviceType?: string;
  status: RequestStatus;
  assignedTo?: string;
  assignedToName?: string;
  solution?: string;
  issues?: Issues;
  urgency?: Urgency;
  attachments?: File[];
  notes?:string;
  assignedDate:string;
  resolvedDate:string;
  problemCategory: ProblemCategory; // ✅ ADD THIS

}

type ServiceRequestContextType = {
  requests: ServiceRequest[];
  loading: boolean;
  refreshRequests: () => Promise<void>;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => Promise<void>;
  addRequest: (requestData: Partial<ServiceRequest>) => Promise<void>;
  getRequestById: (id: string) => ServiceRequest | undefined;
  problemTypes: Issues[];
  problemCategory:ProblemCategory[];
};

const ServiceRequestContext = createContext<ServiceRequestContextType | null>(null);

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const problemTypes = PROBLEM_TYPES;
const problemCategory = PROBLEM_CATEGORY;
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REQUESTS ================= */
  const refreshRequests = async () => {
    const data = await getServiceRequests();
    const formatted = data.map((r: any) => ({
      id: r._id,
      deviceId: r.device?._id,
      serialNumber: r.device?.serialNumber,
      requestedBy: r.requestedBy?.firstName + " " + r.requestedBy?.lastName,
      description: r.description,
      plant: r.device?.plant?.name,
      department: r.device?.department?.name,
      createdAt: r.createdAt,
      assignedDate:r.assignedDate,
      deviceImage: r.device?.image,
      deviceName: r.device?.deviceName,
      deviceType: r.device?.deviceType,
     status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      assignedTo: r.assignedTo?._id,
      assignedToName: r.assignedTo ? r.assignedTo?.firstName + " " + r.assignedTo?.lastName : undefined,
      solution: r.solution,
      urgency: r.urgency,
      issues: r.issues,
      resolvedDate:r.resolvedDate,
      notes:r.notes,
      problemCategory: r.problemCategory,
    }));
    setRequests(formatted);
    setLoading(false); // ✅ IMPORTANT
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  /* ================= ADD REQUEST ================= */
  const addRequest = async (requestData: Partial<ServiceRequest>) => {
    if (!requestData.description) {
    throw new Error("description are required");
  }

  if (!requestData.deviceId) {
    throw new Error("Device is required");
  }

    await apiCreateRequest({
      description: requestData.description,
       problemCategory: requestData.problemCategory|| "Hardware",
      attachments: requestData.attachments || [],
      deviceId: requestData.deviceId
    
    });

    await refreshRequests();
  };

  /* ================= UPDATE REQUEST ================= */
  const updateRequest = async (id: string, data: Partial<ServiceRequest>) => {
    const updated = await updateServiceRequest(id, data);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
  };

  const getRequestById = (id: string) => requests.find((r) => r.id === id);

  return (
    <ServiceRequestContext.Provider
      value={{ requests,loading, refreshRequests, updateRequest, addRequest, getRequestById, problemTypes,problemCategory}}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequests = () => {
  const ctx = useContext(ServiceRequestContext);
  if (!ctx) throw new Error("useServiceRequests must be used inside ServiceRequestProvider");
  return ctx;
};