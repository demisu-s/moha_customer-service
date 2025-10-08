// src/context/ServiceRequestContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

export type Urgency = "Low" | "Medium" | "High" | "";
export type RequestStatus = "Pending" | "Assigned" | "Resolved" | "Unresolved";
export type ProblemCategory = "Hardware" | "Software" | "Network" | "Other" | "";

  export type Issues =
  | "HardDisk Failer"
  | "Window corruption"
  | "Virues"
  | "Window Activation"
  | "Jet Report"
  | "Office Activation"
  | "Other"
  | "";

  export const PROBLEM_TYPES: Issues[] = [
  "HardDisk Failer",
  "Window corruption",
  "Virues",
  "Window Activation",
  "Jet Report",
  "Office Activation",
  "Other",
];


export interface ServiceRequest {
  id: string;
  deviceId: string;
  deviceSerial: string;
  requestedBy: string;
  requestedDate: string;
  area: string;
  description: string;
  department: string;
  userId?: string;
  phone?: string;
  resolvedDate?: string;
  attachments: string[];
  createdAt: string;
  deviceImage?: string;
  deviceName?: string;
  deviceType?: string;
  status: RequestStatus;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  solution?: string;
  issues?: Issues;
  supervisorId?: string;
  assignedDate?: string;
  urgency?: Urgency;
  problemCategory?: ProblemCategory;
}

type ServiceRequestContextType = {
  requests: ServiceRequest[];
  addRequest: (req: ServiceRequest) => void;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => void;
  getRequestById: (id: string) => ServiceRequest | undefined;
};

const ServiceRequestContext = createContext<ServiceRequestContextType | null>(
  null
);

export const ServiceRequestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  // Load from localStorage initially
  useEffect(() => {
    const stored = localStorage.getItem("serviceRequests");
    if (stored) setRequests(JSON.parse(stored));
  }, []);

  // Sync to localStorage when changed
  useEffect(() => {
    localStorage.setItem("serviceRequests", JSON.stringify(requests));
  }, [requests]);

  // 🔄 Sync across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "serviceRequests" && event.newValue) {
        setRequests(JSON.parse(event.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addRequest = (req: ServiceRequest) => {
    setRequests((prev) => [req, ...prev]);
  };

  const updateRequest = (id: string, data: Partial<ServiceRequest>) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const getRequestById = (id: string) => requests.find((r) => r.id === id);

  return (
    <ServiceRequestContext.Provider
      value={{ requests, addRequest, updateRequest, getRequestById }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequests = () => {
  const ctx = useContext(ServiceRequestContext);
  if (!ctx)
    throw new Error(
      "useServiceRequests must be used within a ServiceRequestProvider"
    );
  return ctx;
};
