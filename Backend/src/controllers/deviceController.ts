import { Response } from "express";
import DeviceService from "../services/deviceService";

export const createDevice = async (
  req: any,
  res: Response
) => {
  try {
    const imagePath = req.file
  ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
  : "";

    const device = await DeviceService.createDevice(
      {
        ...req.body,
        image: imagePath,
      },
      req.user
    );

    return res.status(201).json({
      success: true,
      device,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDevice = async (
  req: any,
  res: Response
) => {
  try {
   const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    const device = await DeviceService.updateDevice(
      req.params.id,
      {
        ...req.body,
        image: imagePath,
      },
      req.user
    );

    return res.status(200).json({
      success: true,
      device,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDevices = async (
  req: any,
  res: Response
) => {
  try {
    const devices = await DeviceService.getDevices(
      req.user
    );

    return res.status(200).json({
      success: true,
      devices,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDevice = async (
  req: any,
  res: Response
) => {
  try {
    await DeviceService.deleteDevice(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};