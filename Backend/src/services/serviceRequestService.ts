
import { IDevice } from "../interfaces/types";
import { Request, Response } from "express";
import ServiceRequestModel, { IServiceDocument } from "../models/ServiceRequestModel";

class serviceRequestService {
    deleteServiceRequest: any;
  // Create service request
  async createServiceRequest(req:Request,res:Response) {

    const { deviceId,
        serialNumber,
        requestedBy,
        requestedDate,
        description,
        Plant,
        department,
        userId,
        phone,
        resolvedDate,
        attachments,
        createdAt,
        status,
        assignedTo,
        notes,
        solution,
        issues,
        supervisorId,
        assignedDate,
        urgency,
        problemCategory } = req.body;
    
  
   
    const serviceRequestExists = await ServiceRequestModel.findOne({ _id:String });
    if (serviceRequestExists) throw new Error("Request already exists");
    const serviceRequest = await ServiceRequestModel.create({
        deviceId,
        serialNumber,
        requestedBy,
        requestedDate,
        description,
        Plant,
        department,
        userId,
        phone,
        resolvedDate,
        attachments,
        createdAt,
        status,
        assignedTo,
        notes,
        solution,
        issues,
        supervisorId,
        assignedDate,
        urgency,
    }) as unknown as IDevice & { _id: any };

    return {
      serviceRequest
    };
  }

// update service request
async updateSeviceRequest(req: Request, res: Response) {
    const { _id,
         deviceId,
        serialNumber,
        department,
        userId,
        urgency,
    } = req.body;
  
    if (!_id) throw new Error("request id is required");

    const serviceRequest = await ServiceRequestModel.findByIdAndUpdate(
        _id,
        { 
         deviceId,
        serialNumber,
        department,
        userId,
       
         },
        { new: true, runValidators: true }
    ) as (IServiceDocument & { _id: any }) | null;

    if (!serviceRequest) throw new Error("Request not found");

    return res.status(200).json({ serviceRequest });
}

// Get service requist by ID
 async getServiceRequestById(req:Request,res:Response) {
      const serviceRequest = await ServiceRequestModel.findOne({_id:req.params.id}); 
      try{

        if (!serviceRequest) {
            throw new Error("Request not found");
        }
        return res.status(200).json({ serviceRequest });
      }
      catch(error){
            console.error("Error fetching request:", error);
            throw new Error("Error fetching request");
      }
  }
  

// Get all requests
 async getServiceRequests(req: Request, res: Response) {
     try{
        const serviceRequest = await ServiceRequestModel.find()
       return res.status(200).json({ serviceRequest})
     }
        catch(error){
            console.error("Error fetching request:", error);
            return res.status(500).json({ error: "Error fetching request" });
  }
 }

    // Delete request
 async deleteRequest(req:Request,res:Response) {
    console.log("Deleting request with id:", req.params.id);
      const serviceRequest = await ServiceRequestModel.findByIdAndDelete(req.params.id);
        try{
        if (!serviceRequest) {
            throw new Error("Request not found");
        }
        return res.status(200).json({ message: "Request deleted successfully" });
      }
        catch(error){
            console.error("Error deleting Request:", error);
            throw new Error("Error deleting Request");
      }
      
  
}

}

export default new serviceRequestService();
