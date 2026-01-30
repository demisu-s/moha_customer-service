import mongoose, { Schema, Document } from "mongoose";
import { IDevice } from "../interfaces/device.interface";
export interface IDeviceDocument extends Omit<IDevice, "_id">, Document {}

const deviceSchema = new Schema<IDeviceDocument>(
  {
   
  //  _id: { type: String, required: true },
    deviceName: { type: String, required: true },
    deviceType: { type: String, required: true },
    plant: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
     },
    department: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
     },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     },
    serialNumber: { type: String, required: true },
    image: { 
        data: Buffer,
        type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDeviceDocument>("device", deviceSchema);
