import mongoose, { Schema, Document } from "mongoose";
import { PMWOStatus, PMWOPriority } from "../interfaces/Preventivemaintenance.interface";

// ─── Sub-schemas ────────────────────────────────────────────────────────────

const ProcedureStepSchema = new Schema(
  {
    stepNumber: { type: Number, required: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
  },
  { _id: false }
);

const TaskSchema = new Schema(
  {
    taskName: { type: String, required: true },
    description: { type: String },
    procedures: { type: [ProcedureStepSchema], default: [] },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: "User" },
    estimatedDuration: { type: Number }, // minutes
    actualDuration: { type: Number },    // minutes
  }
);

// ─── Main Schema ─────────────────────────────────────────────────────────────

export interface IPreventiveMaintenanceDocument extends Document {
  title: string;
  description?: string;
  plant: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;

  scheduledDate: Date;
  completedDate?: Date;

  priority: PMWOPriority;
  status: PMWOStatus;

  tasks: mongoose.Types.DocumentArray<any>;

  recurrence?: "none" | "daily" | "weekly" | "monthly";
  cycles?: number;

  notes?: string;
  attachments?: string[];

  createdAt: Date;
  updatedAt: Date;
}

const PreventiveMaintenanceSchema = new Schema<IPreventiveMaintenanceDocument>(
  {
    title: { type: String, required: true },
    description: { type: String },

    plant: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
    },

    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["planned", "in_progress", "completed", "cancelled"],
      default: "planned",
    },

    tasks: { type: [TaskSchema] as any, default: [] },

    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    cycles: { type: Number, default: 1 },

    notes: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IPreventiveMaintenanceDocument>(
  "PreventiveMaintenance",
  PreventiveMaintenanceSchema
);