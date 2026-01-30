
import api from "./axios";
// import { LoginResponse } from "./auth.types";
import { LoginResponse } from "./auth.types";

interface LoginPayload {
  userId: string;
  password: string;
}

export const loginUser = async (
  data: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};
