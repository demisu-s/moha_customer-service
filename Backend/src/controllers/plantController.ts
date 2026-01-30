import { Request, Response, NextFunction } from "express";
import plantService from "../services/plantService";

export const createPlant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plant = await plantService.createPlant(req.body);
    res.status(201).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plant = await plantService.updatePlant(req.params.id, req.body);
    res.json({ success: true, data: plant });
  } catch (error) {
    next(error);
  }
};
export const getPlantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plant = await plantService.getPlantById(req.params.id);
    res.status(200).json({
      success: true,
      data: plant,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const plants = await plantService.getPlants();
    res.status(200).json({
      success: true,
      data: plants, // ✅ ARRAY
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await plantService.deletePlant(req.params.id);
    res.json({ success: true, message: "Plant deleted successfully" });
  } catch (error) {
    next(error);
  }
};
