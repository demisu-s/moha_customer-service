export interface LoginResponse {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  role: "admin" | "supervisor" | "user" | "superadmin";
  gender: "male" | "female";
  department: {
    _id: string;
    name: string;
  };
  token: string;
}
