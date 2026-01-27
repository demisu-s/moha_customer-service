import { Router } from "express";
import {
  createDepartment,
  updateDepartment,
  getDepartmentById,
  getDepartments,
  getDepartmentsByPlant,
  deleteDepartment,
} from "../controllers/departmentController";

const router = Router();

router.post("/createDepartment", createDepartment);
router.put("/updateDepartment/:id", updateDepartment);
router.get("/getDepartmentById/:id", getDepartmentById);
router.get("/getDepartments", getDepartments);
router.get(
  "/getDepartmentsByPlant/:plantId",
  getDepartmentsByPlant
);
router.delete("/deleteDepartment/:id", deleteDepartment);

export default router;
