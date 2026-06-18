// interfaces/Preventivemaintenance.interface.ts
import { Types } from "mongoose";

export type PMWOStatus = "planned" | "in_progress" | "completed" | "cancelled";
export type PMWOPriority = "low" | "medium" | "high" | "critical";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";  // ✅ UPDATED

export interface IProcedureStep {
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: Types.ObjectId;
  notes?: string;
}

export interface ITask {
  _id?: Types.ObjectId;
  taskName: string;
  description?: string;
  procedures: IProcedureStep[];
  isCompleted: boolean;
  completedAt?: Date;
  completedBy?: Types.ObjectId;
  estimatedDuration?: number; // in minutes
  actualDuration?: number;    // in minutes
}

export interface IPreventiveMaintenance {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  plant: Types.ObjectId;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  department?: Types.ObjectId;
  scheduledDate: Date;
  completedDate?: Date;
  priority: PMWOPriority;
  status: PMWOStatus;
  tasks: ITask[];
  recurrence?: RecurrenceType;  // ✅ UPDATED
  cycles?: number;
  notes?: string;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}