import DeviceModel from "../models/DeviceModel";
import User from "../models/User";
import { Role } from "../constants/roles";

class DeviceService {
  async createDevice(data: any, loggedInUser: any) {
    const { deviceName, deviceType, deviceId, serialNumber, user, image } = data;

    if (!loggedInUser) throw new Error("Unauthorized");

    if (
      ![Role.SUPER_ADMIN, Role.ADMIN, Role.SUPERVISOR].includes(
        loggedInUser.role
      )
    ) {
      throw new Error("Not allowed");
    }

    const targetUser = await User.findById(user).populate({
      path: "department",
      populate: { path: "plant" },
    });

    if (!targetUser) throw new Error("Target user not found");

    const targetPlantId =
      (targetUser.department as any).plant._id.toString();

    const loggedPlantId =
      loggedInUser.department.plant._id.toString();

    if (
      loggedInUser.role !== Role.SUPER_ADMIN &&
      targetPlantId !== loggedPlantId
    ) {
      throw new Error("Cannot create device outside your plant");
    }

    const exists = await DeviceModel.findOne({
      $or: [{ deviceId }, { serialNumber }],
    });

    if (exists) throw new Error("Device already exists");

    return await DeviceModel.create({
      deviceName,
      deviceType,
      deviceId,
      serialNumber,
      user,
      department: targetUser.department._id,
      plant: targetPlantId,
      image,
    });
  }

     /* ================= UPDATE DEVICE ================= */

  async updateDevice(id: string, data: any, loggedInUser: any) {
    const { deviceName, deviceType, deviceId, serialNumber, user, image } = data;

    if (!loggedInUser) throw new Error("Unauthorized");

    const device = await DeviceModel.findById(id);

    if (!device) throw new Error("Device not found");

    if (
      loggedInUser.role !== Role.SUPER_ADMIN &&
      device.plant.toString() !== loggedInUser.department.plant._id.toString()
    ) {
      throw new Error("Access denied");
    }

    const targetUser = await User.findById(user).populate({
      path: "department",
      populate: { path: "plant" },
    });

    if (!targetUser) throw new Error("Target user not found");

    const plantId = (targetUser.department as any).plant._id;

    device.deviceName = deviceName;
    device.deviceType = deviceType;
    device.deviceId = deviceId;
    device.serialNumber = serialNumber;
    device.user = user;
    if (!targetUser.department || !targetUser.department._id) {
      throw new Error("Target user's department not found");
    }
    device.department = targetUser.department._id;
    device.plant = plantId;
    device.image = image;

    await device.save();

    return device;
  }
    

  async getDevices(loggedInUser: any) {
    // console.log("my service device", loggedInUser);
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