import mongoose, { Schema, Document } from "mongoose";
import { RequestStatus } from "../constants/request-status";

export interface IServiceDocument extends Document {
  device?: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;

  urgency?: "Low" | "Medium" | "High";

  problemTypes:
    | "HardDisk Failer"
    | "Window corruption"
    | "Virues"
    | "Window Activation"
    | "Jet Report"
    | "Office Activation"
    | "Other";
problemCategory:"Hardware" | "Software" | "Network" | "Other";

    

  status: RequestStatus;

  assignedTo?: mongoose.Types.ObjectId;

  plant?: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;

  description: string;

  attachments?: string[];

  requestedDate?: string;
  resolvedDate?: string;
  assignedDate?: string;

  solution?: string;
  notes?:string;
}

const ServiceRequestSchema = new Schema<IServiceDocument>(
  {


 device: {
      type: Schema.Types.ObjectId,
      ref: "Device",
      required: true, // ✅ important
    },

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

    problemTypes: {
      type: String,
      enum: [
        "HardDisk Failer",
        "Window corruption",
        "Virues",
        "Window Activation",
        "Jet Report",
        "Office Activation",
        "Other",
      ],
    },

    problemCategory:{
      type:String,
      enum:[
        "Hardware",
        "Software",
        "Network",
        "Other",
      ]
    },

    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    plant: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },

    description: {
      type: String,
      required: true,
    },

    attachments: [String],

    requestedDate: String,

    resolvedDate: String,

    assignedDate: String,

    solution: String,
    notes:String,
  },
  { timestamps: true }
);

export default mongoose.model<IServiceDocument>(
  "ServiceRequest",
  ServiceRequestSchema
);