import { PlantPayload } from "./global.types";

export interface LoginResponse {
  photo: string | undefined;
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  role: "admin" | "supervisor" | "user" | "superadmin";
  gender: "male" | "female";
  department: {
    plant: string | PlantPayload;
    block: string | undefined;
    floor: string | undefined;
    _id: string;
    name: string;
  };
  token: string;
}
