import mongoose, { Schema, Document } from "mongoose";
import { IPlant } from "../interfaces/types";

export interface IPlantDocument extends Omit<IPlant, "_id">, Document {}

const plantSchema = new Schema<IPlantDocument>(
  {
    Name: { type: String, required: true },
  City: { type: String, required: true },
  Area: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPlantDocument>("Plant", plantSchema);
