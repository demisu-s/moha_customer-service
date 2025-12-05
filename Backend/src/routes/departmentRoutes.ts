import { Router } from "express";
import { createDepartment, updateDepartment, getDepartmentById, getDepartment, deleteDepartment } from "../controllers/departmentController";

const router = Router();

router.post("/createDepartment",createDepartment);
router.put("/updateDepartment", updateDepartment);
router.get("/getDepartmentById/:id", getDepartmentById);
router.get("/getDepatment", getDepartment);
router.delete("/deleteDepartment/:id", deleteDepartment);


export default router;
