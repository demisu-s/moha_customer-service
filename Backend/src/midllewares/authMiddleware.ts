import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    req.user = await User.findById(decoded.id).populate({
      path: "department",
      populate: { path: "plant" },
    });

    // ✅ Safe logging
    console.log(req.user?.department?.plant?._id);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};
