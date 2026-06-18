// routes/PreventivemaintenanceRoutes.ts
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

// IMPORTANT: Specific routes must come BEFORE generic routes with :id
// Because Express matches routes in order

// ─── Specific routes (with multiple params) ──────────────────────────────
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

// ─── Generic CRUD routes ──────────────────────────────────────────────────
router.patch("/:id/status", protect, updateWorkOrderStatus);
router.get("/:id", protect, getWorkOrderById);
router.put("/:id", protect, updateWorkOrder);
router.delete("/:id", protect, deleteWorkOrder);

// ─── Collection routes ────────────────────────────────────────────────────
router.get("/", protect, getWorkOrders);
router.post("/", protect, createWorkOrder);

export default router;