import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: false,
      unique: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.model("Device", deviceSchema);