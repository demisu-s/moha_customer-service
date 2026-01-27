import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { createUser } from "../api/user.api";

/* ------------------ Types ------------------ */

export type Area =
  | "HO"
  | "Nifas Silk"
  | "Mekelle"
  | "Summit"
  | "Bure"
  | "Hawassa"
  | "Teklehaymanot"
  | "Dessie"
  | "Gonder";

export type Department =
  | "HR"
  | "MIS"
  | "Finance"
  | "Sales"
  | "Procurement"
  | "Marketing"
  | "Planning"
  | "Law"
  | "Quality"
  | "Project"
  | "General Manager"
  | "Security"
  | "Audit";

/** IMPORTANT: backend enum values */
export type Role = "user" | "admin" | "supervisor";
export type Gender = "male" | "female";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  department: string; // ObjectId
  role: Role;
  gender: Gender;
  userId: string;
  phone?: string;
  photo?: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  department: string; // ObjectId
  role: Role;
  gender: Gender;
  userId: string;
  password: string;
  photo?: File | null;
}

/* ------------------ Constants ------------------ */

export const AREAS: Area[] = [
  "HO",
  "Nifas Silk",
  "Mekelle",
  "Summit",
  "Bure",
  "Hawassa",
  "Teklehaymanot",
  "Dessie",
  "Gonder",
];

export const DEPARTMENTS: Department[] = [
  "HR",
  "MIS",
  "Finance",
  "Sales",
  "Procurement",
  "Marketing",
  "Planning",
  "Law",
  "Quality",
  "Project",
  "General Manager",
  "Security",
  "Audit",
];

export const ROLES: Role[] = ["user", "admin", "supervisor"];
export const GENDERS: Gender[] = ["male", "female"];

/* ------------------ Context ------------------ */

interface UserContextType {
  users: User[];
  addUser: (payload: CreateUserPayload) => Promise<void>;
  areas: Area[];
  departments: Department[];
  roles: Role[];
  genders: Gender[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = async (payload: CreateUserPayload) => {
    const created = await createUser(payload);
    setUsers((prev) => [...prev, created]);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        areas: AREAS,
        departments: DEPARTMENTS,
        roles: ROLES,
        genders: GENDERS,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
