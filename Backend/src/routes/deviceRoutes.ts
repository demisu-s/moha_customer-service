import express from "express";
import {
  createDevice,
  getDevices,
  deleteDevice,
  updateDevice,
} from "../controllers/deviceController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";


const router = express.Router();

router.post("/createDevice",protect,authorize("CREATE_DEVICE"),createDevice);
router.get("/getDevice",protect,authorize("VIEW_DEVICE"), getDevices);
router.put("/updateDevice/:id", protect,authorize("UPDATE_DEVICE"),updateDevice);
router.delete("/deleteDevice/:id",protect,authorize("DELETE_DEVICE"),deleteDevice);

export default router;