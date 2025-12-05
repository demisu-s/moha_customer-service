import { Request, Response, NextFunction } from "express";

import plantService from "../services/plantService";

export const createPlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("In controller",req.body)
    const result = await plantService.createPlant(req,res);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await plantService.updatePlant(req,res);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const getPlantById = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await plantService.getPlantById(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPlants = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await plantService.getPlants(req,res);     
    res.json(result);
  } catch (error) {
    next(error);
  }
};
export const deletePlant = async (req: Request, res: Response, next: NextFunction) => {
  try {
     const result = await plantService.deletePlant(req,res);  
    res.json(result);
  } catch (error) {
    next(error);
  }
};
