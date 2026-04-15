import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
  title: string;
  user: mongoose.Types.ObjectId;
  plant: mongoose.Types.ObjectId;

  start: Date;
  end: Date;

  recurrence?: "none" | "daily" | "weekly" | "monthly";
  cycles?: number;

  createdAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    title: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Plant",
  required: true,
},

    start: {
      type: Date,
      required: true,
    },

    end: {
      type: Date,
      required: true,
    },

    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },

    cycles: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);