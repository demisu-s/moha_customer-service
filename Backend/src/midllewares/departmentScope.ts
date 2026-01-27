import Department from "../models/DepartmentModel";
import { Role } from "../constants/roles";

export const departmentScope = async (req: any, res: any, next: any) => {
  if (req.user.role === Role.SUPER_ADMIN) return next();

  const departmentId = req.body.department || req.params.departmentId;
  if (!departmentId) {
    return res.status(400).json({ message: "Department is required" });
  }

  const department = await Department.findById(departmentId);
  if (!department) {
    return res.status(404).json({ message: "Invalid department" });
  }

  const userPlantId = req.user.department.plant._id.toString();
  const targetPlantId = department.plant.toString();

  if (userPlantId !== targetPlantId) {
    return res
      .status(403)
      .json({ message: "Access denied for this plant" });
  }

  next();
};
