import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body;
    const result = await authService.login(userId, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
