import { Request, Response, NextFunction } from "express";

import departmentService from "../services/departmentService";

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("In controller",req.body)
    const result = await departmentService.createDepartment(req,res);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await departmentService.updateDepartment(req,res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await departmentService.getDepartmentById(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await departmentService.getDepartment(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await departmentService.deleteDepartment(req,res);  
    res.json(result);
  } catch (error) {
    next(error);
  }
};
