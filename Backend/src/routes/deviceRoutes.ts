import express from "express";
import {
  createDevice,
  getDevices,
  deleteDevice,
  updateDevice,
} from "../controllers/deviceController";
import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";
import { upload } from "../../uploads/upload";


const router = express.Router();

router.post("/createDevice",protect,authorize("CREATE_DEVICE"),upload.single("image"),createDevice);
router.get("/getDevice",protect,authorize("VIEW_DEVICE"), getDevices);
router.put("/updateDevice/:id",protect,authorize("UPDATE_DEVICE"),upload.single("image"),updateDevice);
router.delete("/deleteDevice/:id",protect,authorize("DELETE_DEVICE"),deleteDevice);

export default router;