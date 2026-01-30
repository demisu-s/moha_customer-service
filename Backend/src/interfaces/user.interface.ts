import { Types } from "mongoose";
import { Role } from "../constants/roles";
import { IDepartment } from "./department.interface";
import { Gender } from "../constants/gender";

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  userId: string;
  password: string;
  department: Types.ObjectId | IDepartment;
  role: Role;
  gender: Gender;
  phone?: string;
  photo?: string;
}
