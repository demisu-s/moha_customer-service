import { Request, Response } from "express";
import ServiceRequestService from "../services/serviceRequestService";
import { RequestStatus } from "../constants/request-status";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role?: string;
    firstName?: string;
    lastName?: string;
  };
}

export const createRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    const files =
      (req.files as Express.Multer.File[]) || [];

    const attachments = files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const request =
      await ServiceRequestService.createRequest(
        {
          ...req.body,
          attachments,
        },
        userId!
      );

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create request",
      error,
    });
  }
};

export const getAllRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await ServiceRequestService.getAllRequests();

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error,
    });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const request = await ServiceRequestService.getRequestById(id);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch request",
      error,
    });
  }
};

// ✅ FIXED: Complete updateRequest with status conversion
export const updateRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const updateData = req.body;
    
    console.log("📥 Backend updateRequest received:", JSON.stringify(updateData, null, 2));
    console.log("📥 User ID:", req.user?.id);
    console.log("📥 User role:", req.user?.role);
    
    // ✅ CRITICAL FIX: Convert status to lowercase if present
    if (updateData.status) {
      // Convert to lowercase to match enum
      updateData.status = updateData.status.toLowerCase();
      console.log("✅ Converted status to lowercase:", updateData.status);
    }
    
    // ✅ CRITICAL FIX: If status is being set to "resolved" or "unresolved"
    if (updateData.status === "resolved" || updateData.status === "unresolved") {
      
      // 1. Always set resolvedBy to current user if not provided
      if (!updateData.resolvedBy && req.user?.id) {
        updateData.resolvedBy = req.user.id;
        console.log("✅ Auto-added resolvedBy:", req.user.id);
      }
      
      // 2. Always set assignedTo to current user if not provided
      if (!updateData.assignedTo && req.user?.id) {
        updateData.assignedTo = req.user.id;
        console.log("✅ Auto-added assignedTo:", req.user.id);
      }
      
      // 3. Set assignedToName if provided
      if (req.user?.firstName && req.user?.lastName && !updateData.assignedToName) {
        updateData.assignedToName = `${req.user.firstName} ${req.user.lastName}`;
        console.log("✅ Auto-added assignedToName:", updateData.assignedToName);
      }
      
      // 4. Ensure urgency is set (default to "Low" if not provided)
      if (!updateData.urgency) {
        updateData.urgency = "Low";
        console.log("✅ Auto-added urgency: Low");
      }
      
      // 5. Ensure problemCategory is preserved
      if (!updateData.problemCategory && req.body.problemCategory) {
        updateData.problemCategory = req.body.problemCategory;
      }
      
      console.log("📤 Final updateData after auto-fill:", JSON.stringify(updateData, null, 2));
    }
    
    const request = await ServiceRequestService.updateRequest(
      id,
      updateData
    );

    console.log("📤 Backend saved request - status:", request?.status);
    console.log("📤 Backend saved request - resolvedBy:", request?.resolvedBy);
    console.log("📤 Backend saved request - assignedTo:", request?.assignedTo);
    console.log("📤 Backend saved request - urgency:", request?.urgency);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update request",
      error,
    });
  }
};

export const assignSupervisor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const { assignedTo, notes, assignedDate, urgency } = req.body;

    const request = await ServiceRequestService.updateRequest(id, {
      assignedTo,
      notes,
      assignedDate,
      urgency,
      status: "assigned", // ✅ Use lowercase
    });

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to assign supervisor",
      error,
    });
  }
};

export const resolveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { solution, issues, urgency, problemCategory } = req.body;
    const resolvedBy = req.user?.id;
    const userName = req.user?.firstName && req.user?.lastName 
      ? `${req.user.firstName} ${req.user.lastName}` 
      : undefined;

    console.log("📥 resolveRequest received:", { solution, issues, urgency, problemCategory });
    console.log("📥 resolvedBy:", resolvedBy);

    // ✅ Use updateRequest to save ALL fields (consistent with admin)
    const request = await ServiceRequestService.updateRequest(id, {
      solution,
      issues,
      urgency: urgency || "Low",
      problemCategory: problemCategory || "Other Services",
      status: "resolved", // ✅ Use lowercase
      resolvedDate: new Date().toISOString(),
      resolvedBy: resolvedBy,
      assignedTo: resolvedBy,
      assignedToName: userName,
    });

    console.log("📤 resolveRequest saved - status:", request?.status);
    console.log("📤 resolveRequest saved - resolvedBy:", request?.resolvedBy);
    console.log("📤 resolveRequest saved - assignedTo:", request?.assignedTo);
    console.log("📤 resolveRequest saved - urgency:", request?.urgency);

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Resolve error:", error);
    res.status(500).json({
      message: "Failed to resolve request",
      error,
    });
  }
};