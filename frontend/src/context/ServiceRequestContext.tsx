import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getServiceRequests,
  createServiceRequest as apiCreateRequest,
  updateServiceRequest,
} from "../api/request.api";

export type Urgency = "Low" | "Medium" | "High" | "";
export type RequestStatus =
  | "Pending"
  | "Assigned"
  | "Resolved"
  | "Unresolved";

export type ProblemCategory = "Desktop" | "Laptop" | "Server" | "Switch" |
   "Access Point" | "Camera" | "Biometric" | "Camera Related" | "Software" | "ERP"
    | "Peachtree" | "Canteen" | "Overtime" | "Other Software" | "Network" | "Network Related"
     | "Internet Related" | "Project Related" | "Other Services";

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
  "Desktop",
  "Laptop",
  "Server",
  "Switch",
  "Access Point",
  "Camera",
  "Biometric",
  "Camera Related",

  "Software",
  "ERP",
  "Peachtree",
  "Canteen",
  "Overtime",
  "Other Software",

  "Network",
  "Network Related",
  "Internet Related",
  "Project Related",
  "Other Services"
];

export interface ServiceRequest {
  _id: string;
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
  resolvedBy?: string;
  resolvedByName?: string;
  solution?: string;
  issues?: Issues;
  urgency: Urgency; // ✅ Make it required (not optional)

  attachments?: string[];

  notes?: string;
  assignedDate: string;
  resolvedDate: string;

  problemCategory: ProblemCategory;
}

type ServiceRequestContextType = {
  requests: ServiceRequest[];
  loading: boolean;
  refreshRequests: () => Promise<void>;
  updateRequest: (
    id: string,
    data: Partial<ServiceRequest>
  ) => Promise<void>;
  addRequest: (
    requestData: Partial<ServiceRequest>
  ) => Promise<void>;
  getRequestById: (
    id: string
  ) => ServiceRequest | undefined;
  problemTypes: Issues[];
  problemCategory: ProblemCategory[];
};

const ServiceRequestContext =
  createContext<ServiceRequestContextType | null>(
    null
  );

export const ServiceRequestProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [requests, setRequests] = useState<
    ServiceRequest[]
  >([]);

  const [loading, setLoading] = useState(true);

  const problemTypes = PROBLEM_TYPES;
  const problemCategory = PROBLEM_CATEGORY;

  /* ================= FETCH REQUESTS ================= */

  const refreshRequests = async () => {
    try {
      const data = await getServiceRequests();

      console.log("REQUEST FROM API:", data);

      const formatted = data.map((r: any) => ({
        id: r._id,
        _id: r._id,

        deviceId: r.device?._id || "",
        serialNumber: r.device?.serialNumber || "",

        requestedBy: r.requestedBy
          ? `${r.requestedBy.firstName} ${r.requestedBy.lastName}`
          : "",

        description: r.description || "",

        plant: r.device?.plant?.name || "",
        department: r.device?.department?.name || "",

        createdAt: r.createdAt,

        assignedDate: r.assignedDate || "",
        resolvedDate: r.resolvedDate || "",

        deviceImage: r.device?.image || "",
        deviceName: r.device?.deviceName || "",
        deviceType: r.device?.deviceType || "",

        status:
          r.status?.charAt(0).toUpperCase() +
          r.status?.slice(1),

        assignedTo: r.assignedTo?._id,
        assignedToName: r.assignedTo
          ? `${r.assignedTo.firstName} ${r.assignedTo.lastName}`
          : undefined,

        resolvedBy: r.resolvedBy?._id || r.resolvedBy,
        resolvedByName: r.resolvedBy
          ? `${r.resolvedBy.firstName} ${r.resolvedBy.lastName}`
          : r.resolvedByName || undefined,

        solution: r.solution,
        
        // ✅ CRITICAL FIX: Ensure urgency is always set
        urgency: r.urgency || "Low", // ✅ Default to "Low" if not provided
        
        issues: r.issues,
        notes: r.notes,

        problemCategory:
          r.problemCategory || "Other Services",

        attachments: r.attachments || [],
      }));

      setRequests(formatted);
    } catch (error) {
      console.error(
        "Failed to fetch requests:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRequests();
  }, []);

  /* ================= ADD REQUEST ================= */

  const addRequest = async (
    requestData: Partial<ServiceRequest>
  ) => {
    if (!requestData.description) {
      throw new Error("Description is required");
    }

    if (!requestData.deviceId) {
      throw new Error("Device is required");
    }

    const res = await apiCreateRequest({
      description: requestData.description,
      problemCategory: requestData.problemCategory || "Other Services",
      attachments: (requestData.attachments as any) || [],
      deviceId: requestData.deviceId,
    });

    const r = res;

    const newRequest: ServiceRequest = {
      id: r._id,
      _id: r._id,
      deviceId: r.device?._id || r.device || "",
      serialNumber: r.device?.serialNumber || "",
      requestedBy: r.requestedBy
        ? `${r.requestedBy.firstName} ${r.requestedBy.lastName}`
        : "",
      description: r.description || "",
      plant: r.device?.plant?.name || "",
      department: r.device?.department?.name || "",
      createdAt: r.createdAt,
      assignedDate: r.assignedDate || "",
      resolvedDate: r.resolvedDate || "",
      deviceImage: r.device?.image || "",
      deviceName: r.device?.deviceName || "",
      deviceType: r.device?.deviceType || "",
      status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      assignedTo: r.assignedTo?._id,
      assignedToName: r.assignedTo
        ? `${r.assignedTo.firstName} ${r.assignedTo.lastName}`
        : undefined,
      resolvedBy: r.resolvedBy?._id,
      resolvedByName: r.resolvedBy
        ? `${r.resolvedBy.firstName} ${r.resolvedBy.lastName}`
        : undefined,
      solution: r.solution,
      
      // ✅ Ensure urgency is set
      urgency: r.urgency || "Low",
      
      issues: r.issues,
      notes: r.notes,
      problemCategory: r.problemCategory || "Other Services",
      attachments: r.attachments || [],
    };

    setRequests((prev) => [newRequest, ...prev]);

    refreshRequests().catch((err) => {
      console.error("Refresh failed:", err);
    });
  };

  /* ================= UPDATE REQUEST ================= */

  const updateRequest = async (
    id: string,
    data: Partial<ServiceRequest>
  ) => {
    // ✅ Ensure urgency is always included in the update
    const updateData = { ...data };
    if (!updateData.urgency) {
      // If urgency is not provided, try to preserve existing value or default to "Low"
      const existing = requests.find((r) => r.id === id);
      updateData.urgency = existing?.urgency || "Low";
    }
    
    await updateServiceRequest(id, updateData);
    await refreshRequests();
  };

  const getRequestById = (id: string) =>
    requests.find((r) => r.id === id);

  return (
    <ServiceRequestContext.Provider
      value={{
        requests,
        loading,
        refreshRequests,
        updateRequest,
        addRequest,
        getRequestById,
        problemTypes,
        problemCategory,
      }}
    >
      {children}
    </ServiceRequestContext.Provider>
  );
};

export const useServiceRequests = () => {
  const ctx = useContext(ServiceRequestContext);

  if (!ctx) {
    throw new Error(
      "useServiceRequests must be used inside ServiceRequestProvider"
    );
  }

  return ctx;
};