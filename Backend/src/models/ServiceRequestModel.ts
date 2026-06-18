import mongoose, { Schema, Document } from "mongoose";
import { RequestStatus } from "../constants/request-status";

export interface IServiceDocument extends Document {
  device?: mongoose.Types.ObjectId;
  requestedBy: mongoose.Types.ObjectId;
  resolvedBy?: mongoose.Types.ObjectId;

  urgency?: "Low" | "Medium" | "High";

 issues?:
  | "HardDisk Failure"
  | "Windows Corruption"
  | "Virus"
  | "Windows Activation"
  | "Jet Report"
  | "Office Activation"
  | "Other";
problemCategory:"Desktop" | "Printer" | "UPS" | "TV" | "Laptop" | "Server" | "Switch" |
   "Access Point" | "Camera" | "Biometric" | "Camera Related" | "Software" | "ERP"
    | "Peachtree" | "Canteen" | "Overtime" | "Other Software" | "Network" | "Network Related"
     | "Internet Related" | "Project Related" | "Other Services";

    

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
    resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

    urgency: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },

   issues: {
  type: String,
  enum: [
    "HardDisk Failure",
    "Windows Corruption",
    "Virus",
    "Windows Activation",
    "Jet Report",
    "Office Activation",
    "Other",
  ],
},
    problemCategory:{
      type:String,
      enum:[
        "Desktop",
        "Printer",
        "UPS",
        "TV",
        "Laptop",
        "Server",
        "Switch",
        "Access Point",
        "Camera",
        "Biometric",
        "Camera Related",


        "Software",
        "ERP",
        "Peachtree",
        "Canteen",
        "Overtime",
        "Other Software",

        "Network",
         "Network Related",
         "Internet Related",
        "Project Related",
        "Other Services"
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