export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
// ---------- PLANT ----------
export interface PlantPayload {
  _id: string;
  name: string;
  city: string;
  area: string;
}

// ---------- DEPARTMENT (from backend) ----------
export interface DepartmentPayload {
  _id: string;
  name: string;
  block?: string;
  floor?: string;
  plant: string | PlantPayload;
}

// ---------- CREATE / UPDATE (to Backend)----------
export interface CreateDepartmentPayload {
  name: string;
  block?: string;
  floor?: string;
  plant: string;
}

// ---------- USER (from backend) ----------
export interface UserPayload {
  _id: string;
  firstName: string;
  lastName: string;
  department: string;
  role: "admin" | "supervisor" | "user"|"superadmin";
  gender: "male" | "female";
  userId: string;
  password: string;
  photo?: File | null;
}
// ---------- CREATE / UPDATE (to Backend)----------
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

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  department: DepartmentPayload; // object, because backend populates
  role: "admin" | "supervisor" | "user" | "superadmin";
  gender: "male" | "female";
  userId: string;
  photo?: string;
}
