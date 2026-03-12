import ServiceRequest from "../models/ServiceRequestModel";
import Device from "../models/DeviceModel";
import { RequestStatus } from "../constants/request-status";

class ServiceRequestService {

  
  async createRequest(data: any, userId: string) {

    let plant = null;
    let department = null;

    if (data.deviceId) {
      const device = await Device.findById(data.deviceId);

      if (device) {
        plant = device.plant;
        department = device.department;
      }
    }

    const request = await ServiceRequest.create({
      deviceId: data.deviceId,   // this is Mongo _id
      description: data.description,
      problemCategory: data.problemCategory,
      requestedBy: userId,
      plant,
      department,
      requestedDate: new Date().toISOString(),
      status: RequestStatus.PENDING
    });

    return request;
  }
  async getAllRequests() {
    return ServiceRequest.find()
      .populate({
        path: "deviceId",
        populate: ["plant", "department", "user"],
      })
      .populate("requestedBy", "-password")
      .populate("assignedTo", "-password");
  }


  async getRequestById(id: string) {
    return ServiceRequest.findById(id)
      .populate({
        path: "deviceId",
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