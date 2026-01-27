import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body;
    const result = await authService.login(userId, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
