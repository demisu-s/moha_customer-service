import DeviceModel from "../models/DeviceModel";
import User from "../models/User";
import { Role } from "../constants/roles";

class DeviceService {
  async createDevice(data: any, loggedInUser: any) {
    const {
      deviceName,
      deviceType,
      deviceId,
      serialNumber,
      user,
      department,
      plant,
      image,
    } = data;

    if (!loggedInUser) throw new Error("Unauthorized");

    if (
      ![Role.SUPER_ADMIN, Role.ADMIN, Role.SUPERVISOR].includes(
        loggedInUser.role
      )
    ) {
      throw new Error("Not allowed");
    }

    let finalDepartment;
    let finalPlant;

    // ================= USER PROVIDED =================
    if (user) {
      const targetUser = await User.findById(user).populate({
        path: "department",
        populate: { path: "plant" },
      });

      if (!targetUser) throw new Error("Target user not found");

      if (!targetUser.department)
        throw new Error("Target user has no department");
      if (!(targetUser.department as any).plant)
        throw new Error("Target user's department has no plant");

      finalDepartment = (targetUser.department as any)._id;
      finalPlant = ((targetUser.department as any).plant as any)._id;

      // plant access check
      const loggedPlantId =
        loggedInUser.department.plant._id.toString();

      if (
        loggedInUser.role !== Role.SUPER_ADMIN &&
        finalPlant.toString() !== loggedPlantId
      ) {
        throw new Error("Cannot create device outside your plant");
      }
    }

    // ================= NO USER (IMPORT CASE) =================
    else {
  if (!department || !plant) {
    throw new Error(
      "Department and Plant required when user is not provided"
    );
  }

  // ================= ACCESS CONTROL =================

  if (loggedInUser.role !== Role.SUPER_ADMIN) {
    const loggedPlantId =
      loggedInUser.department.plant._id.toString();

    if (plant.toString() !== loggedPlantId) {
      throw new Error(
        "Cannot create device outside your plant"
      );
    }
  }

  finalDepartment = department;
  finalPlant = plant;
}

    // ================= DUPLICATE CHECK =================
    const exists = await DeviceModel.findOne({
      $or: [{ deviceId }, { serialNumber }],
    });

    if (exists) throw new Error("Device already exists");

    const createdDevice = await DeviceModel.create({
  deviceName,
  deviceType,
  deviceId,
  serialNumber,
  user: user || null,
  department: finalDepartment,
  plant: finalPlant,
  image,
});

return await DeviceModel.findById(createdDevice._id)
  .populate("user")
  .populate("department")
  .populate("plant");
  }

  /* ================= UPDATE DEVICE ================= */

  async updateDevice(id: string, data: any, loggedInUser: any) {
    const {
      deviceName,
      deviceType,
      deviceId,
      serialNumber,
      user,
      department,
      plant,
      image,
    } = data;

    if (!loggedInUser) throw new Error("Unauthorized");

    const device = await DeviceModel.findById(id);

    if (!device) throw new Error("Device not found");

    if (
      loggedInUser.role !== Role.SUPER_ADMIN &&
      device.plant.toString() !==
        loggedInUser.department.plant._id.toString()
    ) {
      throw new Error("Access denied");
    }

    let finalDepartment = device.department;
    let finalPlant = device.plant;

    if (user) {
      const targetUser = await User.findById(user).populate({
        path: "department",
        populate: { path: "plant" },
      });

      if (!targetUser)
        throw new Error("Target user not found");

      if (!targetUser.department)
        throw new Error("Target user has no department");
      if (!(targetUser.department as any).plant)
        throw new Error("Target user's department has no plant");

      finalDepartment = (targetUser.department as any)._id;
      finalPlant = ((targetUser.department as any).plant as any)._id;
    } else if (department && plant) {
      finalDepartment = department;
      finalPlant = plant;
    }

    device.deviceName = deviceName;
    device.deviceType = deviceType;
    device.deviceId = deviceId;
    device.serialNumber = serialNumber;
    device.user = user || null;
    device.department = finalDepartment;
    device.plant = finalPlant;
    device.image = image;

    await device.save();

return await DeviceModel.findById(device._id)
  .populate("user")
  .populate("department")
  .populate("plant");
  }

  /* ================= GET ================= */

  async getDevices(loggedInUser: any) {
    if (loggedInUser.role === Role.SUPER_ADMIN) {
      return DeviceModel.find()
        .populate("user")
        .populate("department")
        .populate("plant");
    }

    return DeviceModel.find({
      plant: loggedInUser.department.plant._id,
    })
      .populate("user")
      .populate("department")
      .populate("plant");
  }

  /* ================= DELETE ================= */

  async deleteDevice(id: string, loggedInUser: any) {
    const device = await DeviceModel.findById(id);

    if (!device) throw new Error("Device not found");

    if (
      loggedInUser.role !== Role.SUPER_ADMIN &&
      device.plant.toString() !==
        loggedInUser.department.plant._id.toString()
    ) {
      throw new Error("Access denied");
    }

    await device.deleteOne();
    return true;
  }
}

export default new DeviceService();