import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error: ", err.message);
  res.status(400).json({ message: err.message || "Server Error" });
};
