import { Request, Response } from "express";
import DeviceService from "../services/deviceService";

export const createDevice = async (req: any, res: Response) => {
  try {
    const device = await DeviceService.createDevice(
      req.body,
      req.user
    );
    res.status(201).json({ success: true, device });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDevice = async (req: any, res: Response) => {
  try {
    const device = await DeviceService.updateDevice(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({ success: true, device });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const getDevices = async (req: any, res: Response) => {
  // console.log("my device",res)
  try {
    const devices = await DeviceService.getDevices(req.user);
    console.log(devices)
    res.status(200).json({ success: true, devices });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDevice = async (req: any, res: Response) => {
  try {
    await DeviceService.deleteDevice(req.params.id, req.user);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};