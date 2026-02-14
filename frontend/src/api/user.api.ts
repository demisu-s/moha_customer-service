import api from "./axios";
import { User, UserPayload } from "./global.types";

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

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/auth/getUsers");
  return res.data; 
};

export const deleteUser = (id: string) =>
  api.delete<{ success: boolean }>(`/auth/deleteUser/${id}`);   
export const updateUser = async (id: string, data: any) => {
  const res = await api.put(`/auth/updateUser/${id}`, data);
  return res.data;
};



