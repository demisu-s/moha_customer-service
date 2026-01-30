import mongoose, { Schema, Document } from "mongoose";
import { IPlant } from "../interfaces/plant.interface";
export interface IPlantDocument extends Omit<IPlant, "_id">, Document {}

const plantSchema = new Schema<IPlantDocument>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPlantDocument>("Plant", plantSchema);
