import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "../interfaces/user.interface";
import { Role } from "../constants/roles";
import { Gender } from "../constants/gender";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    department: {
      type: Types.ObjectId,
      ref: "Department",
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    phone: { type: String },
    photo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUserModel>("User", userSchema);
