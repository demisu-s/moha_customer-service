import { IDepartment } from "./Department";
import { IPlant } from "./Plant";
import { IUser } from "./User";

export interface IDevice {
  _id?: string;
  Name: string;
  Type: string;
  Plant: IPlant;
  Department: IDepartment;
  User: IUser;
  SerialNumber: string;
  // Use Buffer for binary image data (Node) or string for a URL/base64
  Image: Buffer | string;
}