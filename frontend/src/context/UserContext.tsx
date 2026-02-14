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
  updateUser,
} from "../api/user.api";

import { getPlants } from "../api/plant.api";
import { getDepartmentsByPlant } from "../api/department.api";

import {
  PlantPayload,
  DepartmentPayload,
  CreateUserPayload,
} from "../api/global.types";

/* ------------------ Types ------------------ */
export type Role = "user" | "admin" | "supervisor" | "superadmin";
export type Gender = "male" | "female";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  department?: DepartmentPayload;
  role: Role;
  gender: Gender;
  userId: string;
  photo?: string;
}

/* ------------------ Context Type ------------------ */
interface UserContextType {
  users: User[];
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  plants: PlantPayload[];
  departments: DepartmentPayload[];
  roles: Role[];
  genders: Gender[];
  loadDepartments: (plantId: string) => Promise<void>;
  addUser: (payload: CreateUserPayload) => Promise<void>;
  refreshUsers: () => Promise<void>;
  updateUserHandler: (
    id: string,
    data: Partial<CreateUserPayload>
  ) => Promise<void>;
  deleteUserHandler: (id: string) => Promise<void>;
}

/* ------------------ Context ------------------ */
const UserContext = createContext<UserContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<PlantPayload[]>([]);
  const [departments, setDepartments] = useState<DepartmentPayload[]>([]);

  /* ------------------ Load Users ------------------ */
  const refreshUsers = useCallback(async () => {
  try {
    const users = await getUsers();
    setUsers(users ?? []);
  } catch (error) {
    console.error("Failed to load users", error);
    setUsers([]);
  }
}, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  /* ------------------ Restore Session on Refresh ------------------ */
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  /* ------------------ Load Plants ------------------ */
  useEffect(() => {
    getPlants()
      .then((res) => setPlants(res.data?.data ?? []))
      .catch(() => setPlants([]));
  }, []);

  /* ------------------ Load Departments ------------------ */
  const loadDepartments = useCallback(async (plantId: string) => {
    try {
      const deps = await getDepartmentsByPlant(plantId);
      setDepartments(deps ?? []);
    } catch (error) {
      console.error("Failed to load departments", error);
      setDepartments([]);
    }
  }, []);

  /* ------------------ Login ------------------ */
  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("userId", user.userId);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  /* ------------------ Logout ------------------ */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("currentUser");

    setCurrentUser(null);
    setUsers([]);
  };

  /* ------------------ Create User ------------------ */
  const addUser = async (payload: CreateUserPayload) => {
  await createUser(payload); // create user on backend
  await refreshUsers();      // fetch all users again
};

  /* ------------------ Delete User ------------------ */
  const deleteUserHandler = async (id: string) => {
    await deleteUserApi(id);
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };

  /* ------------------ Update User ------------------ */
  const updateUserHandler = async (
    id: string,
    data: Partial<CreateUserPayload>
  ) => {
    const updatedUser = await updateUser(id, data) as User;
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? updatedUser : user
      )
    );
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        login,
        logout,
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

/* ------------------ Hook ------------------ */
export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return ctx;
};
