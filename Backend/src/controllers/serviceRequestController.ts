import { Request, Response, NextFunction } from "express";

import requestService from "../services/serviceRequestService";

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await requestService.createServiceRequest(req,res);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSeviceRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await requestService.updateSeviceRequest(req,res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getServiceRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await requestService.getServiceRequestById(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await requestService.getServiceRequests(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await requestService.deleteServiceRequest(req,res);  
    res.json(result);
  } catch (error) {
    next(error);
  }
};
