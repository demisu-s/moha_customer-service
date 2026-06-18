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
      device: data.deviceId,
      requestedDate: new Date().toISOString(),
      attachments: data.attachments || [],
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
      .populate("assignedTo", "-password")
      .populate("resolvedBy", "-password");
  }

  async getRequestById(id: string) {
    return ServiceRequest.findById(id)
      .populate({
        path: "device",
        populate: ["plant", "department", "user"],
      })
      .populate("requestedBy", "-password")
      .populate("assignedTo", "-password")
      .populate("resolvedBy", "-password");
  }

  // ✅ FIXED: Complete updateRequest with all fields
  async updateRequest(id: string, data: any) {
    console.log("📝 Service updateRequest called with data:", data);
    
    // Make sure we preserve all fields
    const updateData = { ...data };
    
    // ✅ Convert status to lowercase if present
    if (updateData.status) {
      updateData.status = updateData.status.toLowerCase();
    }
    
    // Log what's being saved
    console.log("✅ Saving with status:", updateData.status);
    console.log("✅ resolvedBy:", updateData.resolvedBy);
    console.log("✅ assignedTo:", updateData.assignedTo);
    console.log("✅ urgency:", updateData.urgency);
    console.log("✅ problemCategory:", updateData.problemCategory);
    console.log("✅ solution:", updateData.solution);
    console.log("✅ issues:", updateData.issues);
    
    const result = await ServiceRequest.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    console.log("📤 Updated document:", result);
    return result;
  }

  async assignSupervisor(requestId: string, data: any) {
    return ServiceRequest.findByIdAndUpdate(
      requestId,
      {
        ...data,
        status: "assigned", // ✅ Use lowercase
      },
      { new: true }
    );
  }

  async resolveRequest(id: string, solution: string, issues?: string, resolvedBy?: string) {
    const updateData: any = {
      solution,
      issues,
      status: "resolved", // ✅ Use lowercase
      resolvedDate: new Date().toISOString(),
    };
    
    if (resolvedBy) {
      updateData.resolvedBy = resolvedBy;
      updateData.assignedTo = resolvedBy;
    }
    
    console.log("📝 resolveRequest update data:", updateData);
    
    return ServiceRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  }
}

export default new ServiceRequestService();