import api from "./axios";
import { DepartmentPayload } from "./global.types";
import { CreateDepartmentPayload } from "./global.types";



/* ---------- DEPARTMENTS ---------- */
export const getDepartmentsByPlant = async (
  plantId: string
): Promise<DepartmentPayload[]> => {
  const res = await api.get<{
    success: boolean;
    data: DepartmentPayload[];
  }>(`/department/getDepartmentsByPlant/${plantId}`);

  // ✅ return the ARRAY only
  return res.data.data;
};



export const createDepartment = (payload: CreateDepartmentPayload) =>
  api.post<{ success: boolean; data: DepartmentPayload }>(
    "/department/createDepartment",
    payload
  );




export const updateDepartment = (
  id: string,
  data: Partial<DepartmentPayload>
) =>
  api.put<{ success: boolean; data: DepartmentPayload }>(
    `/department/updateDepartment/${id}`,
    data
  );

export const deleteDepartment = (id: string) =>
  api.delete<{ success: boolean }>(
    `/department/deleteDepartment/${id}`
  );
