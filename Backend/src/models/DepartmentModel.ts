import mongoose, { Schema, Document } from "mongoose";
import { IDepartment } from "../interfaces/types";

export interface IDepartmentDocument extends Omit<IDepartment, "_id">, Document {}

const plantSchema = new Schema<IDepartmentDocument>(
  {
   _id: { type: String, required: true },
  Name: { type: String, required: true },
  Block: { type: String },
  Floor: { type: String},
  },
  { timestamps: true }
);

export default mongoose.model<IDepartmentDocument>("Department", plantSchema);
