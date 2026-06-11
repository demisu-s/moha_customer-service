import express from "express";
import {
  createWorkOrder,
  getWorkOrders,
  getWorkOrderById,
  updateWorkOrderStatus,
  completeTask,
  completeProcedureStep,
  updateWorkOrder,
  deleteWorkOrder,
} from "../controllers/Preventivemaintenancecontroller";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();
// In your routes file, make sure the order is correct:
// Specific routes should come before generic ones

router.patch(
  "/:workOrderId/tasks/:taskId/procedures/complete",
  protect,
  completeProcedureStep
);

router.patch(
  "/:workOrderId/tasks/:taskId/complete",
  protect,
  completeTask
);

router.patch("/:id/status", protect, updateWorkOrderStatus);
router.get("/:id", protect, getWorkOrderById);
router.put("/:id", protect, updateWorkOrder);
router.delete("/:id", protect, deleteWorkOrder);
router.get("/", protect, getWorkOrders);
router.post("/", protect, createWorkOrder);
export default router;