import Department from "../models/DepartmentModel";
import { Role } from "../constants/roles";
import { AuthRequest } from "./authMiddleware";

export const departmentScope = async (
  req: AuthRequest,
  res: any,
  next: any
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // SUPER ADMIN bypass
    if (req.user.role === Role.SUPER_ADMIN) {
      return next();
    }

    // 🚨 If user has no department assigned
    if (!req.user.department) {
      return res.status(400).json({
        message: "User has no department assigned",
      });
    }

    // 🚨 If department has no plant
    if (!req.user.department.plant) {
      return res.status(400).json({
        message: "User department has no plant assigned",
      });
    }

    const departmentId =
      req.body.department ||
      req.params.departmentId ||
      req.user.department._id;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({
        message: "Invalid department",
      });
    }

    const userPlantId = req.user.department.plant._id.toString();
    const targetPlantId = department.plant.toString();

    if (userPlantId !== targetPlantId) {
      return res.status(403).json({
        message: "Access denied for this plant",
      });
    }

    next();
  } catch (error: any) {
    console.error("DepartmentScope FULL ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};