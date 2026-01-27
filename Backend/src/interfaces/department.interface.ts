import { Types } from "mongoose";
import {IPlant} from "./plant.interface";

export interface IDepartment {
  _id?: Types.ObjectId;
  name: string;
  block: string;
  floor: string;
  plant: Types.ObjectId | IPlant;
}
