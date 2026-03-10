import { Router } from "express";
import { createPlant, updatePlant, getPlantById, getPlants, deletePlant } from "../controllers/plantController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.post("/createPlant", createPlant);
router.put("/updatePlant/:id", updatePlant);
router.get("/getPlantById/:id", getPlantById);
router.get("/getPlants", getPlants);
router.delete("/deletePlant/:id", deletePlant);




export default router;
