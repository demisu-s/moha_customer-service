import PreventiveMaintenance from "../models/Preventivemaintenancemodel";

class PreventiveMaintenanceService {

  // ─── CREATE ──────────────────────────────────────────────────────────────

   async createWorkOrder(data: any, userId: string) {
    const {
      title,
      description,
      plant,
      assignedTo,
      department,
      scheduledDate,
      priority,
      tasks,
      recurrence,
      cycles,
      notes,
      attachments,
    } = data;

    // Validate plant is present
    if (!plant) {
      console.error("CreateWorkOrder Error: Plant is missing", { data, userId });
      throw new Error("Plant is required. Please ensure your account has a plant assigned.");
    }

    if (!scheduledDate) throw new Error("Scheduled date is required");

    console.log("Creating work order with plant:", plant, "for user:", userId);

    const workOrders = [];
    const baseDate = new Date(scheduledDate);

    // First work order
    workOrders.push({
      title,
      description,
      plant, // This should be a valid ObjectId string
      createdBy: userId,
      assignedTo,
      department,
      scheduledDate: baseDate,
      priority: priority || "medium",
      status: "planned",
      tasks: tasks || [],
      recurrence: recurrence || "none",
      cycles: cycles || 1,
      notes,
      attachments,
    });

    // Recurring work orders
    if (recurrence && recurrence !== "none") {
      const count = cycles || 1;
      for (let i = 1; i <= count; i++) {
        const nextDate = new Date(baseDate);

        if (recurrence === "daily") nextDate.setDate(baseDate.getDate() + i);
        if (recurrence === "weekly") nextDate.setDate(baseDate.getDate() + i * 7);
        if (recurrence === "monthly") nextDate.setMonth(baseDate.getMonth() + i);

        workOrders.push({
          title,
          description,
          plant,
          createdBy: userId,
          assignedTo,
          department,
          scheduledDate: nextDate,
          priority: priority || "medium",
          status: "planned",
          tasks: tasks || [],
          recurrence,
          cycles,
          notes,
          attachments,
        });
      }
    }

    const created = await PreventiveMaintenance.insertMany(workOrders);
    console.log("Created work orders:", created.map(wo => ({ id: wo._id, plant: wo.plant })));
    return created;
  }

  // ─── GET ALL (SuperAdmin: all plants) ────────────────────────────────────

  async getAllWorkOrders() {
    return PreventiveMaintenance.find()
      .populate("plant", "name")
      .populate("createdBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName")
      .populate("department", "name")
      .sort({ scheduledDate: 1 });
  }

  // ─── GET BY PLANT (Admin / Supervisor) ───────────────────────────────────

  async getWorkOrdersByPlant(plantId: string) {
    return PreventiveMaintenance.find({ plant: plantId })
      .populate("plant", "name")
      .populate("createdBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName")
      .populate("department", "name")
      .sort({ scheduledDate: 1 });
  }

  // ─── GET SINGLE ──────────────────────────────────────────────────────────

  async getWorkOrderById(id: string) {
    return PreventiveMaintenance.findById(id)
      .populate("plant", "name")
      .populate("createdBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName")
      .populate("department", "name")
      .populate("tasks.completedBy", "firstName lastName")
      .populate("tasks.procedures.completedBy", "firstName lastName");
  }

  // ─── UPDATE STATUS ───────────────────────────────────────────────────────

  async updateStatus(id: string, status: string) {
    const update: any = { status };
    if (status === "completed") update.completedDate = new Date();
    return PreventiveMaintenance.findByIdAndUpdate(id, update, { new: true });
  }

  // ─── COMPLETE A TASK ─────────────────────────────────────────────────────

  async completeTask(workOrderId: string, taskId: string, userId: string, actualDuration?: number) {
    const workOrder = await PreventiveMaintenance.findById(workOrderId);
    if (!workOrder) throw new Error("Work order not found");

    const task = workOrder.tasks.id(taskId);
    if (!task) throw new Error("Task not found");

    task.isCompleted = true;
    task.completedAt = new Date();
    task.completedBy = userId as any;
    if (actualDuration !== undefined) task.actualDuration = actualDuration;

    // Auto-complete all procedures when task is marked done
    task.procedures.forEach((step: any) => {
      if (!step.isCompleted) {
        step.isCompleted = true;
        step.completedAt = new Date();
        step.completedBy = userId;
      }
    });

    // If all tasks done → auto-set work order to completed
    const allDone = workOrder.tasks.every((t: any) => t.isCompleted);
    if (allDone) {
      workOrder.status = "completed";
      workOrder.completedDate = new Date();
    } else if (workOrder.status === "planned") {
      workOrder.status = "in_progress";
    }

    await workOrder.save();
    return workOrder;
  }

  // ─── COMPLETE A PROCEDURE STEP ───────────────────────────────────────────

  async completeProcedureStep(
    workOrderId: string,
    taskId: string,
    stepNumber: number,
    userId: string,
    notes?: string
  ) {
    const workOrder = await PreventiveMaintenance.findById(workOrderId);
    if (!workOrder) throw new Error("Work order not found");

    const task = workOrder.tasks.id(taskId);
    if (!task) throw new Error("Task not found");

    const step = task.procedures.find((p: any) => p.stepNumber === stepNumber);
    if (!step) throw new Error("Procedure step not found");

    step.isCompleted = true;
    step.completedAt = new Date();
    step.completedBy = userId;
    if (notes) step.notes = notes;

    // Update work order status to in_progress when first step is touched
    if (workOrder.status === "planned") workOrder.status = "in_progress";

    await workOrder.save();
    return workOrder;
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────

  async updateWorkOrder(id: string, data: any) {
    return PreventiveMaintenance.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────

  async deleteWorkOrder(id: string) {
    return PreventiveMaintenance.findByIdAndDelete(id);
  }
}

export default new PreventiveMaintenanceService();