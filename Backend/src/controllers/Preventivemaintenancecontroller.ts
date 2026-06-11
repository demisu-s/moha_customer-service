import { Request, Response } from "express";
import PreventiveMaintenanceService from "../services/Preventivemaintenanceservice";
import { AuthRequest } from "../middlewares/authMiddleware";

// Helper to safely get string parameter
const getStringParam = (param: string | string[] | undefined): string | undefined => {
  return Array.isArray(param) ? param[0] : param;
};

// ─── CREATE WORK ORDER ───────────────────────────────────────────────────────

export const createWorkOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const body = { ...req.body };

    // For admin, set plant from their department
    if (user.role === "admin") {
      const plantId = user.department?.plant?._id || user.department?.plant;
      
      if (!plantId) {
        return res.status(400).json({ message: "Your account has no plant assigned" });
      }
      body.plant = plantId.toString();
    }

    // Superadmin must provide plant
    if (user.role === "superadmin" && !body.plant) {
      return res.status(400).json({ message: "Plant is required" });
    }

    // Supervisor cannot create work orders
    if (user.role === "supervisor") {
      return res.status(403).json({ message: "Supervisors cannot create work orders" });
    }

    const workOrders = await PreventiveMaintenanceService.createWorkOrder(body, user.id);
    return res.status(201).json({ success: true, data: workOrders });
  } catch (error) {
    console.error("Create work order error:", error);
    return res.status(500).json({ message: "Failed to create work order", error });
  }
};

// ─── GET ALL WORK ORDERS ─────────────────────────────────────────────────────

export const getWorkOrders = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    let workOrders;

    if (user.role === "superadmin") {
      workOrders = await PreventiveMaintenanceService.getAllWorkOrders();
    } else {
      // Admin and Supervisor: get only their plant's work orders
      const plantId = user.department?.plant?._id || user.department?.plant;
      if (!plantId) {
        return res.status(400).json({ message: "Your account has no plant assigned" });
      }
      workOrders = await PreventiveMaintenanceService.getWorkOrdersByPlant(plantId.toString());
    }

    return res.json({ success: true, data: workOrders });
  } catch (error) {
    console.error("Failed to fetch work orders:", error);
    return res.status(500).json({ message: "Failed to fetch work orders", error });
  }
};

// ─── GET SINGLE WORK ORDER ───────────────────────────────────────────────────

export const getWorkOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id = getStringParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid work order ID" });

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(id);
    
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    // Check plant access for non-superadmin
    if (user.role !== "superadmin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "Access denied: not your plant" });
      }
    }

    return res.json({ success: true, data: workOrder });
  } catch (error) {
    console.error("Failed to fetch work order:", error);
    return res.status(500).json({ message: "Failed to fetch work order", error });
  }
};

// ─── UPDATE STATUS ───────────────────────────────────────────────────────────

export const updateWorkOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { status } = req.body;
    const allowed = ["planned", "in_progress", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const id = getStringParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid work order ID" });

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(id);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    // Check plant access for non-superadmin
    if (user.role !== "superadmin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "Access denied: not your plant" });
      }
    }

    const updated = await PreventiveMaintenanceService.updateStatus(id, status);
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update status:", error);
    return res.status(500).json({ message: "Failed to update status", error });
  }
};

// ─── COMPLETE A TASK ─────────────────────────────────────────────────────────

export const completeTask = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const workOrderId = getStringParam(req.params.workOrderId);
    const taskId = getStringParam(req.params.taskId);
    const { actualDuration } = req.body;

    if (!workOrderId || !taskId) {
      return res.status(400).json({ message: "Invalid work order ID or task ID" });
    }

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(workOrderId);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    // Check plant access for non-superadmin
    if (user.role !== "superadmin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "Access denied: not your plant" });
      }
    }

    const updated = await PreventiveMaintenanceService.completeTask(
      workOrderId,
      taskId,
      user.id,
      actualDuration
    );

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to complete task:", error);
    return res.status(500).json({ message: "Failed to complete task", error });
  }
};

// ─── COMPLETE A PROCEDURE STEP ───────────────────────────────────────────────

export const completeProcedureStep = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const workOrderId = getStringParam(req.params.workOrderId);
    const taskId = getStringParam(req.params.taskId);
    const { stepNumber, notes } = req.body;

    if (!workOrderId || !taskId) {
      return res.status(400).json({ message: "Invalid work order ID or task ID" });
    }

    if (!stepNumber) {
      return res.status(400).json({ message: "stepNumber is required" });
    }

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(workOrderId);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    // Check plant access for non-superadmin
    if (user.role !== "superadmin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "Access denied: not your plant" });
      }
    }

    const updated = await PreventiveMaintenanceService.completeProcedureStep(
      workOrderId,
      taskId,
      stepNumber,
      user.id,
      notes
    );

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to complete procedure step:", error);
    return res.status(500).json({ message: "Failed to complete procedure step", error });
  }
};

// ─── UPDATE WORK ORDER ───────────────────────────────────────────────────────

export const updateWorkOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role === "supervisor") {
      return res.status(403).json({ message: "Supervisors are not allowed to update work orders" });
    }

    const id = getStringParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid work order ID" });

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(id);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    if (user.role === "admin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "You can only update your plant work orders" });
      }
    }

    const updated = await PreventiveMaintenanceService.updateWorkOrder(id, req.body);
    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Failed to update work order:", error);
    return res.status(500).json({ message: "Failed to update work order", error });
  }
};

// ─── DELETE WORK ORDER ───────────────────────────────────────────────────────

export const deleteWorkOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (user.role === "supervisor") {
      return res.status(403).json({ message: "You are not allowed to delete work orders" });
    }

    const id = getStringParam(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid work order ID" });

    const workOrder = await PreventiveMaintenanceService.getWorkOrderById(id);
    if (!workOrder) return res.status(404).json({ message: "Work order not found" });

    if (user.role === "admin") {
      const userPlantId = (user.department?.plant?._id || user.department?.plant)?.toString();
      const workOrderPlantId = workOrder.plant?._id?.toString() || workOrder.plant?.toString();
      
      if (userPlantId !== workOrderPlantId) {
        return res.status(403).json({ message: "You can only delete your plant work orders" });
      }
    }

    await PreventiveMaintenanceService.deleteWorkOrder(id);
    return res.json({ success: true, message: "Work order deleted" });
  } catch (error) {
    console.error("Failed to delete work order:", error);
    return res.status(500).json({ message: "Failed to delete work order", error });
  }
};