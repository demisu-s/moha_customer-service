import mongoose, { Schema, Document } from "mongoose";
import { IDepartment } from "../interfaces/department.interface";
export interface IDepartmentDocument extends Omit<IDepartment, "_id">, Document {}

const departmentSchema = new Schema<IDepartmentDocument>(
  {
    name: { type: String, required: true },
    block: { type: String },
    floor: { type: String },

    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDepartmentDocument>("Department", departmentSchema);
