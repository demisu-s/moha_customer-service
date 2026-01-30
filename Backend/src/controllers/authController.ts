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

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getUsers();
    res.json(users);
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

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await authService.deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  } 
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await authService.updateUser(id, data);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};