import { Types } from "mongoose";
import { IDevice } from "./device.interface";
import { IUser } from "./user.interface";
import { IPlant } from "./plant.interface";
import { IDepartment } from "./department.interface";
import { RequestStatus } from "../constants/request-status";

export interface IServiceRequest {
  _id?: Types.ObjectId;

  deviceId: Types.ObjectId | IDevice;
  serialNumber: string;

  requestedBy: Types.ObjectId | IUser;

  plant?: Types.ObjectId | IPlant;
  department?: Types.ObjectId | IDepartment;
  userId?: Types.ObjectId | IUser;

  requestedDate: string;
  description: string;

  status: RequestStatus;

  assignedTo?: Types.ObjectId | IUser;
  supervisorId?: Types.ObjectId | IUser;

  phone: string;
  attachments?: string;

  resolvedDate?: string;
  assignedDate?: string;

  urgency?: "Low" | "Medium" | "High";
  problemCategory?: "Hardware" | "Software" | "Network" | "Other";

  notes?: string;
  solution?: string;
  issues?: string;

  createdAt?: string;
  updatedAt?: string;
}