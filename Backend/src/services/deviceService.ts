import DeviceModel from "../models/DeviceModel";
import { IDevice } from "../interfaces/device.interface";
import { Request, Response } from "express";

class deviceService {
  // Create device
  async createDevice(req:Request,res:Response) {
     //console.log("In service",req.body)

    const { deviceName,deviceType,  plant,department,user,serialNumber,image} = req.body;
   
    const deviceExists = await DeviceModel.findOne({ deviceName:deviceName });
    if (deviceExists) throw new Error("Device already exists");
console.log("",req.body)
    const device = await DeviceModel.create({
     deviceName,  
     deviceType,  
      plant,
      department,
        user,
        serialNumber,
        image
    }) as IDevice & { _id: any };

    return {
      device
    };
  }

// update device
async updateDevice(req: Request, res: Response) {
    const { _id,deviceName, deviceType,department,plant,serialNumber,image} = req.body;
  
    if (!_id) throw new Error("device id is required");

    const device = await DeviceModel.findByIdAndUpdate(
        _id,
        { 
        deviceName,
        deviceType, 
        department,
        plant,
        serialNumber,
        image },
        { new: true, runValidators: true }
    ) as (IDevice & { _id: any }) | null;

    if (!device) throw new Error("Device not found");

    return res.status(200).json({ device });
}

// Get device by ID
 async getDeviceById(req:Request,res:Response) {
      const device = await DeviceModel.findOne({_id:req.params.id}); 
      try{

        if (!device) {
            throw new Error("Device not found");
        }
        return res.status(200).json({device});
      }
      catch(error){
            console.error("Error fetching device:", error);
            throw new Error("Error fetching device");
      }
  }
  

// Get all devices
 async getDevices(req: Request, res: Response) {
     try{
        const device = await DeviceModel.find()
       return res.status(200).json({ device})
     }
        catch(error){
            console.error("Error fetching device:", error);
            return res.status(500).json({ error: "Error fetching device" });
  }
 }

    // Delete device
 async deleteDevice(req:Request,res:Response) {
    console.log("Deleting device with id:", req.params.id);
      const device = await DeviceModel.findByIdAndDelete(req.params.id);
        try{
        if (!device) {
            throw new Error("Device not found");
        }
        return res.status(200).json({ message: "Device deleted successfully" });
      }
        catch(error){
            console.error("Error deleting device:", error);
            throw new Error("Error deleting device");
      }
      
  
}

}

export default new deviceService();
