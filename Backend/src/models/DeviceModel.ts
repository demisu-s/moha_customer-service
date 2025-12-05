import mongoose, { Schema, Document } from "mongoose";
import { IDevice } from "../interfaces/device";
import { IPlant } from "../interfaces/Plant";

export interface IDeviceDocument extends Omit<IDevice, "_id">, Document {}

const plantSchema = new Schema<IDeviceDocument>(
  {
   
   _id: { type: String, required: true },
    Name: { type: String, required: true },
    Type: { type: String, required: true },
    Plant: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
     },
    Department: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
     },
    User: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     },
    SerialNumber: { type: String, required: true },
    // Use Buffer for binary image data (Node) or string for a URL/base64
    Image: { 
        data: Buffer,
        type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDeviceDocument>("Plant", plantSchema);
