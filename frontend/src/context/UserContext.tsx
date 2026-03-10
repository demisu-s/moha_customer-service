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

import { STORAGE_KEYS } from "../constants/storageKeys";

/* ========================= TYPES ========================= */

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

/* ========================= CONTEXT TYPE ========================= */

interface UserContextType {
  users: User[];
  currentUser: User | null;
  isLoadingUser: boolean;
  login: (user: User, token: string) => void;
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

/* ========================= CONTEXT ========================= */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ========================= PROVIDER ========================= */

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [plants, setPlants] = useState<PlantPayload[]>([]);
  const [departments, setDepartments] = useState<DepartmentPayload[]>([]);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  /* ========================= LOAD USERS ========================= */

  const refreshUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response ?? []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  /* ========================= RESTORE SESSION ========================= */

  useEffect(() => {
    const restoreSession = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (storedUser && storedToken) {
          const parsedUser: User = JSON.parse(storedUser);

          const normalizedUser: User = {
            ...parsedUser,
            role: parsedUser.role.toLowerCase() as Role,
          };

          setCurrentUser(normalizedUser);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Session restore failed. Clearing storage.");
        localStorage.clear();
        setCurrentUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    restoreSession();
  }, []);

  /* ========================= LOAD PLANTS ========================= */

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const res = await getPlants();
        setPlants(res.data?.data ?? []);
      } catch (error) {
        console.error("Failed to load plants:", error);
        setPlants([]);
      }
    };

    loadPlants();
  }, []);

  /* ========================= LOAD DEPARTMENTS ========================= */

  const loadDepartments = useCallback(async (plantId: string) => {
    try {
      const deps = await getDepartmentsByPlant(plantId);
      setDepartments(deps ?? []);
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    }
  }, []);

  /* ========================= LOGIN ========================= */

  const login = (user: User, token: string) => {
    const normalizedUser: User = {
      ...user,
      role: user.role.toLowerCase() as Role,
    };

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_ID, normalizedUser.userId);
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(normalizedUser)
    );

    setCurrentUser(normalizedUser);
  };

  /* ========================= LOGOUT ========================= */

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setCurrentUser(null);
    setUsers([]);
  };

  /* ========================= CREATE USER ========================= */

  const addUser = async (payload: CreateUserPayload) => {
    await createUser(payload);
    await refreshUsers();
  };

  /* ========================= DELETE USER ========================= */

  const deleteUserHandler = async (id: string) => {
    await deleteUserApi(id);
    setUsers((prev) => prev.filter((user) => user._id !== id));
  };

  /* ========================= UPDATE USER ========================= */

  const updateUserHandler = async (
    id: string,
    data: Partial<CreateUserPayload>
  ) => {
    const updatedUser = (await updateUser(id, data)) as User;

    setUsers((prev) =>
      prev.map((user) => (user._id === id ? updatedUser : user))
    );
  };

  /* ========================= PROVIDER ========================= */

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        isLoadingUser,
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

/* ========================= HOOK ========================= */

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return ctx;
};