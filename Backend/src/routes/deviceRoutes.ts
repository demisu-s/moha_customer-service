import { Router } from "express";
import { createDevice, updateDevice, getDeviceById, getDevices, deleteDevice } from "../controllers/deviceController";

const router = Router();

router.post("/createDevice",createDevice);
router.put("/updateDevice", updateDevice);
router.get("/getDeviceById/:id", getDeviceById);
router.get("/getDevice", getDevices);
router.delete("/deleteDevice/:id", deleteDevice);


export default router;
