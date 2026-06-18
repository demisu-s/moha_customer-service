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


// ---------- DEVICE (from backend) ----------
export interface Device {
  _id: string;
  deviceName: string;
  deviceType: "Printer" | "Laptop" | "Desktop" | "Scanner" |"Router" | "Switch"|"Other";
  deviceId: string;
  serialNumber: string;
  user?: User | null;
  department: DepartmentPayload; // full object
  plant: PlantPayload; // full object
  image?: string;
}

export interface CreateDevicePayload {
  deviceName: string;
  deviceType: "Printer" | "Laptop" | "Desktop" | "Scanner" | "Router" | "Switch" | "Other";
  deviceId: string;
  serialNumber: string;

  user?: string | null;
  department: string; // ObjectId
  plant: string;      // ObjectId

   image?: File | null;
}

/* ================= CREATE REQUEST ================= */

export interface CreateServiceRequestPayload {
  description: string;
  deviceId: string;

  attachments?: File[];
  problemCategory:"Desktop" | "Laptop" | "Server" | "Switch" |
   "Access Point" | "Camera" | "Biometric" | "Camera Related" | "Software" | "ERP"
    | "Peachtree" | "Canteen" | "Overtime" | "Other Software" | "Network" | "Network Related"
     | "Internet Related" | "Project Related" | "Other Services";

  issues?: string;
  requestedDate?: string;
}

/* ================= SCHEDULE ================= */

// export type Recurrence = "none" | "daily" | "weekly" | "monthly";
export type Recurrence = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface ScheduleEvent {
  _id: string;
  title: string;
  start: string; // ISO from backend
  end: string;
  recurrence?: Recurrence;
  cycles?: number;
}

export interface CreateSchedulePayload {
  title: string;
  start: Date;
  end: Date;
  plant: string;
  recurrence?: Recurrence;
  cycles?: number;
}