import api from "./axios";
import { CreateUserPayload, User } from "../context/UserContext";

export const createUser = async (
  data: CreateUserPayload
): Promise<User> => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};
