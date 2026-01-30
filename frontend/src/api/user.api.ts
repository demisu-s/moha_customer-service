import api from "./axios";

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  department: string;
  role: "admin" | "supervisor" | "user"|"superadmin";
  gender: "male" | "female";
  userId: string;
  password: string;
  photo?: File | null;
}

export const createUser = async (payload: CreateUserPayload): Promise<any> => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as any);
    }
  });

  const res = await api.post<any>("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
};

export const getUsers = () =>
  api.get<{ success: boolean; data: any[] }>("/auth/getUsers");

export const deleteUser = (id: string) =>
  api.delete<{ success: boolean }>(`/auth/deleteUser/${id}`);   
export const updateUser = (id: string, data: Partial<CreateUserPayload>) =>
  api.put<{ success: boolean; data: any }>(`/auth/updateUser/${id}`, data);


