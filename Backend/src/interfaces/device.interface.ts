import { Types } from "mongoose";
import { IPlant } from "./plant.interface";
import { IDepartment } from "./department.interface";
import { IUser } from "./user.interface";

export interface IDevice {
  _id?: Types.ObjectId;
  deviceName: string;
  deviceType: string;
  deviceId: string;

  plant: Types.ObjectId | IPlant;
  department: Types.ObjectId | IDepartment;
  user: Types.ObjectId | IUser;

  serialNumber: string;
  image: Buffer | string;
}
