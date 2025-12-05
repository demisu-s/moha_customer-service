import { IDepartment } from "./Department";
import { IDevice } from "./device";
import { IPlant } from "./Plant";
import { IUser } from "./User";

export interface IServiceRequest {
  _id?: string;
  deviceId: IDevice;
  deviceSerial: string;
  requestedBy: IUser;
  requestedDate: string;
  description: string;
  Plant: IPlant;  
  department: IDepartment;
  userId?: IUser;
  phone?: string;
  resolvedDate?: string;
  attachments: string;
  createdAt: string;
  status: RequestStatus;
  assignedTo?: IUser;
  notes?: string;
  solution?: string;
  issues?: Issues;
  supervisorId?: IUser;
  assignedDate?: string;
  urgency?: string;
  problemCategory?: String;
}