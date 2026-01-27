import { Types } from "mongoose";

export interface IPlant {
  _id?: Types.ObjectId;
  name: string;
  city: string;
  area: string;
}
