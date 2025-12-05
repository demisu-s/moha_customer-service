import { Request, Response, NextFunction } from "express";

import deviceService from "../services/deviceService";

export const createDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deviceService.createDevice(req,res);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await deviceService.updateDevice(req,res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getDeviceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await deviceService.getDeviceById(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await deviceService.getDevices(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await deviceService.deleteDevice(req,res);  
    res.json(result);
  } catch (error) {
    next(error);
  }
};
