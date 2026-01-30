import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  createUser,
  getUsers,
  deleteUser as deleteUserApi,
  updateUser
  ,CreateUserPayload
} from "../api/user.api";
import { getPlants } from "../api/plant.api";
import { getDepartmentsByPlant } from "../api/department.api";
import { UserPayload, PlantPayload, DepartmentPayload, } from "../api/global.types";

/* ------------------ Types ------------------ */
export type Role = "user" | "admin" | "supervisor" | "superadmin";
export type Gender = "male" | "female";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  department: DepartmentPayload;
  role: Role;
  gender: Gender;
  userId: string;
  photo?: string;
}

/* ------------------ Context ------------------ */
interface UserContextType {
  users: User[];
  plants: PlantPayload[];
  departments: DepartmentPayload[];
  roles: Role[];
  genders: Gender[];
  loadDepartments: (plantId: string) => Promise<void>;
  addUser: (payload: CreateUserPayload) => Promise<void>;
  refreshUsers: () => Promise<void>;
  updateUserHandler: (id: string, data: Partial<CreateUserPayload>) => Promise<void>;
  deleteUserHandler: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<PlantPayload[]>([]);
  const [departments, setDepartments] = useState<DepartmentPayload[]>([]);

  /* ------------------ Load Users ------------------ */
 const refreshUsers = useCallback(async () => {
  try {
    const res = await getUsers();
    console.log("getUsers response:", res.data); // debug
    setUsers(Array.isArray(res.data) ? res.data : []);
  } catch (error) {
    console.error("Failed to load users", error);
    setUsers([]);
  }
}, []);


  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  /* ------------------ Load Plants ------------------ */
  useEffect(() => {
    getPlants()
      .then((res) => setPlants(res.data.data || []))
      .catch(() => setPlants([]));
  }, []);

  /* ------------------ Load Departments by Plant ------------------ */
  const loadDepartments = useCallback(async (plantId: string) => {
    try {
      const deps = await getDepartmentsByPlant(plantId);
      setDepartments(deps || []);
    } catch (error) {
      console.error("Failed to load departments", error);
      setDepartments([]);
    }
  }, []);

  /* ------------------ Create User ------------------ */
  const addUser = async (payload: CreateUserPayload) => {
    const created = await createUser(payload);
    setUsers((prev) => [...prev, created]);
  };

  /* ------------------ Delete User ------------------ */
  const deleteUserHandler = async (id: string) => {
    await deleteUserApi(id);
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };

  /* ------------------ Update User ------------------ */
  const updateUserHandler = async (id: string, data: Partial<CreateUserPayload>) => {
    const res = await updateUser(id, data);
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id && res && typeof res === "object" ? { ...user, ...res } : user
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        users,
        plants,
        departments,
        roles: ["user", "admin", "supervisor", "superadmin"],
        genders: ["male", "female"],
        loadDepartments,
        addUser,
        refreshUsers,
        updateUserHandler,
        deleteUserHandler,
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
