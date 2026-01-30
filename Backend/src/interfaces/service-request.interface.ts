import { Types } from "mongoose";
import { IDevice } from "./device.interface";
import { IUser } from "./user.interface";
import { IPlant } from "./plant.interface";
import { IDepartment } from "./department.interface";
import { RequestStatus } from "../constants/request-status";


export interface IServiceRequest {
  _id?: Types.ObjectId;

  device: Types.ObjectId | IDevice;
  requestedBy: Types.ObjectId | IUser;
  deviceId: Types.ObjectId | IDevice;
  serialNumber: Types.ObjectId | IDevice;

  plant: Types.ObjectId | IPlant;
  department: Types.ObjectId | IDepartment;
  userId: Types.ObjectId | IUser;

  requestedDate: string;
  description: string;

  status: RequestStatus;

  assignedTo?: Types.ObjectId | IUser;
  supervisorId?: Types.ObjectId | IUser;

  phone?: string;
  attachments?: string;

  resolvedDate?: string;
  createdAt: string;
  assignedDate?: string;

  urgency?: string;
  problemCategory?: string;
  notes?: string;
  solution?: string;
  issues?: string;
}
