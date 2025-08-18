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
  updateUser: (id: number, updatedData: Omit<User, "id">) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


const initialUsers: User[] = [
  {
    id: 1,
    firstName: "System",
    lastName: "Admin",
    area: "HO",
    department: "MIS",
    role: "Admin",
    gender: "Male",
    userId: "admin",
    password: "admin123",
  }
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
     
    const updateUser = (id: number, updatedData: Omit<User, "id">) => {
  setUsers((prev) =>
    prev.map((user) => (user.id === id ? { ...user, ...updatedData } : user))
  );
};

  return (
    <UserContext.Provider value={{ users, addUser, deleteUser, updateUser}}>
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