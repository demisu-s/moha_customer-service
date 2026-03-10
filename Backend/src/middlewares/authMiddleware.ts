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
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate({
        path: "department",
        populate: { path: "plant" },
      });

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};