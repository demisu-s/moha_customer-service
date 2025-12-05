import { Router } from "express";
import { createPlant, updatePlant, getPlantById, getPlants, deletePlant } from "../controllers/plantController";
import { protect } from "../midllewares/authMiddleware";

const router = Router();

router.post("/createPlant",createPlant);
router.put("/updatePlant", updatePlant);
router.get("/getPlantById/:id", getPlantById);
router.get("/getPlants", getPlants);
router.delete("/deletePlant/:id", deletePlant);


export default router;
