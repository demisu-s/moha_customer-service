import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getPMWorkOrders,
  createPMWorkOrder,
  updatePMWorkOrderStatus,
  completeTask,
  completeProcedureStep,
  deletePMWorkOrder,
} from "../api/preventiveMaintenance.api";
import { useUserContext } from "./UserContext";

export interface IProcedureStep {
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: any;
  notes?: string;
}

export interface ITask {
  _id: string;
  taskName: string;
  description?: string;
  procedures: IProcedureStep[];
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: any;
  estimatedDuration?: number;
  actualDuration?: number;
}

export interface IWorkOrder {
  _id: string;
  title: string;
  description?: string;
  plant: any;
  createdBy: any;
  assignedTo?: any;
  department?: any;
  scheduledDate: string;
  completedDate?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "planned" | "in_progress" | "completed" | "cancelled";
  tasks: ITask[];
  recurrence?: string;
  cycles?: number;
  notes?: string;
}

type PMWOContextType = {
  workOrders: IWorkOrder[];
  loading: boolean;
  refreshWorkOrders: () => Promise<void>;
  addWorkOrder: (data: any) => Promise<void>;
  changeStatus: (id: string, status: string) => Promise<void>;
  markTaskComplete: (workOrderId: string, taskId: string, duration?: number) => Promise<void>;
  markStepComplete: (workOrderId: string, taskId: string, stepNumber: number, notes?: string) => Promise<void>;
  removeWorkOrder: (id: string) => Promise<void>;
};

const PMWOContext = createContext<PMWOContextType | null>(null);

export const PMWOProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workOrders, setWorkOrders] = useState<IWorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUserContext();

  /* ===== FETCH ===== */
  const refreshWorkOrders = async () => {
    setLoading(true);
    try {
      const data = await getPMWorkOrders();
      setWorkOrders(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) refreshWorkOrders();
  }, [currentUser]);

  /* ===== ADD ===== */
  const addWorkOrder = async (data: any) => {
    const created = await createPMWorkOrder(data);
    // created can be array (recurrence) or single object
    const newItems = Array.isArray(created) ? created : [created];
    setWorkOrders((prev) => [...prev, ...newItems]);
  };

  /* ===== STATUS ===== */
  const changeStatus = async (id: string, status: string) => {
    const updated = await updatePMWorkOrderStatus(id, status);
    setWorkOrders((prev) =>
      prev.map((wo) => (wo._id === id ? { ...wo, ...updated } : wo))
    );
  };

  /* ===== COMPLETE TASK ===== */
  const markTaskComplete = async (workOrderId: string, taskId: string, duration?: number) => {
    const updated = await completeTask(workOrderId, taskId, duration);
    setWorkOrders((prev) =>
      prev.map((wo) => (wo._id === workOrderId ? updated : wo))
    );
  };

  /* ===== COMPLETE STEP ===== */
  const markStepComplete = async (
    workOrderId: string,
    taskId: string,
    stepNumber: number,
    notes?: string
  ) => {
    const updated = await completeProcedureStep(workOrderId, taskId, stepNumber, notes);
    setWorkOrders((prev) =>
      prev.map((wo) => (wo._id === workOrderId ? updated : wo))
    );
  };

  /* ===== DELETE ===== */
  const removeWorkOrder = async (id: string) => {
    await deletePMWorkOrder(id);
    setWorkOrders((prev) => prev.filter((wo) => wo._id !== id));
  };

  return (
    <PMWOContext.Provider
      value={{
        workOrders,
        loading,
        refreshWorkOrders,
        addWorkOrder,
        changeStatus,
        markTaskComplete,
        markStepComplete,
        removeWorkOrder,
      }}
    >
      {children}
    </PMWOContext.Provider>
  );
};

export const usePMWO = () => {
  const ctx = useContext(PMWOContext);
  if (!ctx) throw new Error("usePMWO must be used inside PMWOProvider");
  return ctx;
};
