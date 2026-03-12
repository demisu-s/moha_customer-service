import express from "express";

import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  assignSupervisor,
  resolveRequest,
} from "../controllers/serviceRequestController";

import { protect } from "../middlewares/authMiddleware";
import { authorize } from "../middlewares/authorize";

const router = express.Router();

router.post("/createRequest", protect, createRequest);

router.get("/getRequests",getAllRequests);

router.get("/getRequestById/:id", protect, getRequestById);

router.put("/updateRequestById/:id", protect, updateRequest);

router.put("/assign/assignedSupervisor/:id", protect, assignSupervisor);

router.put("/resolve/:id", protect, resolveRequest);

export default router;