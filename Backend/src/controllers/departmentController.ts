import { Request, Response, NextFunction } from "express";
import departmentService from "../services/departmentService";

export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const department = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const department = await departmentService.getDepartmentById(
      req.params.id
    );
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentsByPlant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments =
      await departmentService.getDepartmentsByPlant(req.params.plantId);

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await departmentService.getDepartments();
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await departmentService.deleteDepartment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
