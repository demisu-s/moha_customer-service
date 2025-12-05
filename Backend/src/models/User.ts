import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/types";

export interface IUserModel extends Omit<IUser, "_id">, Document {}

const userSchema = new Schema<IUserModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>("User", userSchema);
