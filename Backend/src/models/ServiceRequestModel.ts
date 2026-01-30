import mongoose, { Schema, Document } from "mongoose";
import { IServiceRequest } from "../interfaces/service-request.interface";


export interface IServiceDocument extends Omit<IServiceRequest, "_id">, Document {}

const ServiceRequestSchema = new Schema<IServiceDocument>(
  {
   
  id: { type: String, required: true },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
    },
    serialNumber: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
     },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    requestedDate: { type: String, required: true },
    description: { type: String, required: true },
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    phone: { type: String, required: true },
    resolvedDate: { type: String },
    attachments: { 
        data: Buffer,
        type: String
    },
    createdAt: { type: String, required: true },
    status: { type: String, required: true },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notes: { type: String, required: true },
    solution: { type: String },
    issues: { type: String },
    supervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedDate: { type: String },
    urgency: { type: String },
    problemCategory: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IServiceDocument>("ServiceRequest", ServiceRequestSchema);
