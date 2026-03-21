import ServiceRequest from "../models/ServiceRequestModel";
import Device from "../models/DeviceModel";
import { RequestStatus } from "../constants/request-status";

class ServiceRequestService {
  async createRequest(data: any, userId: string) {
    if (!data.deviceId) {
      throw new Error("Device is required");
    }

    const device = await Device.findById(data.deviceId);

    if (!device) {
      throw new Error("Device not found");
    }

    const request = await ServiceRequest.create({
      description: data.description,
      problemCategory: data.problemCategory,
      requestedBy: userId,
      device: data.deviceId, // ✅ correct
      requestedDate: new Date().toISOString(),
    });

    return request;
  }

  async getAllRequests() {
    return ServiceRequest.find()
      .populate({
        path: "device",
        populate: ["plant", "department", "user"],
      })
      .populate("requestedBy", "-password")
      .populate("assignedTo", "-password");
  }

  async getRequestById(id: string) {
    return ServiceRequest.findById(id)
      .populate({
        path: "device",
        populate: ["plant", "department", "user"],
      })
      .populate("requestedBy", "-password")
      .populate("assignedTo", "-password");
  }
async updateRequest(id: string, data: any) {
    return ServiceRequest.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async assignSupervisor(requestId: string, supervisorId: string) {
    return ServiceRequest.findByIdAndUpdate(
      requestId,
      {
        assignedTo: supervisorId,
        status: RequestStatus.ASSIGNED,
        assignedDate: new Date().toISOString(),
      },
      { new: true }
    );
  }

  async resolveRequest(id: string, solution: string) {
    return ServiceRequest.findByIdAndUpdate(
      id,
      {
        solution,
        status: RequestStatus.RESOLVED,
        resolvedDate: new Date().toISOString(),
      },
      { new: true }
    );
  }
}

export default new ServiceRequestService();