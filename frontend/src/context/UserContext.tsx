import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  area: string;
  department: string;
  role: string;
  gender: string;
  userId: string;
  password: string;
  photo?: File | null;
};

type UserContextType = {
  users: User[];
  addUser: (user: Omit<User, "id">) => void;
  deleteUser: (id: number) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 1, firstName: "Kebede", lastName: "Kasa", area: "HO", department: "MIS", role: "Admin", gender: "Male", userId: "kebede", password: "pass" },
  { id: 2, firstName: "Abebe", lastName: "Kasa", area: "Kality", department: "MIS", role: "Supervisor", gender: "Male", userId: "abebe", password: "pass" },
  { id: 3, firstName: "Alem", lastName: "Kasa", area: "Summit", department: "Finance", role: "User", gender: "Female", userId: "alem", password: "pass" },
  { id: 4, firstName: "Alex", lastName: "Kasa", area: "Kality", department: "HR", role: "User", gender: "Male", userId: "alex", password: "pass" },
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : initialUsers;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (newUser: Omit<User, "id">) => {
    setUsers((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, ...newUser },
    ]);
  };

    const deleteUser = (id: number) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
    };

  return (
    <UserContext.Provider value={{ users, addUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};