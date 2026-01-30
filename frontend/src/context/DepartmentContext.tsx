import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  getDepartmentsByPlant,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/department.api";
import {
  DepartmentPayload,
  CreateDepartmentPayload,
} from "../api/global.types";

/* ------------------ Context Type ------------------ */
interface DepartmentContextType {
  departments: DepartmentPayload[];
  refreshDepartments: (plantId: string) => Promise<void>;
  addDepartment: (payload: CreateDepartmentPayload) => Promise<void>;
  updateDepartmentHandler: (
    id: string,
    data: Partial<CreateDepartmentPayload>
  ) => Promise<void>;
  deleteDepartmentHandler: (id: string) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(
  undefined
);

/* ------------------ Provider ------------------ */
export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState<DepartmentPayload[]>([]);

  /* -------- Load -------- */
  const refreshDepartments = useCallback(async (plantId: string) => {
    try {
      const res = await getDepartmentsByPlant(plantId);
      setDepartments(res ?? []);
    } catch (err) {
      console.error("Failed to load departments", err);
      setDepartments([]);
    }
  }, []);

  /* -------- Create -------- */
const addDepartment = async (payload: CreateDepartmentPayload) => {
  const res = await createDepartment(payload);
  setDepartments((prev) => [...prev, res.data.data as DepartmentPayload]);
};

  /* -------- Update -------- */
  const updateDepartmentHandler = async (
    id: string,
    data: Partial<CreateDepartmentPayload>
  ) => {
    const res = await updateDepartment(id, data);
    setDepartments((prev) =>
      prev.map((d) => (d._id === id ? res.data.data : d))
    );
  };

  /* -------- Delete -------- */
  const deleteDepartmentHandler = async (id: string) => {
    await deleteDepartment(id);
    setDepartments((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        refreshDepartments,
        addDepartment,
        updateDepartmentHandler,
        deleteDepartmentHandler,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

/* ------------------ Hook ------------------ */
export const useDepartmentContext = () => {
  const ctx = useContext(DepartmentContext);
  if (!ctx) {
    throw new Error(
      "useDepartmentContext must be used inside DepartmentProvider"
    );
  }
  return ctx;
};
