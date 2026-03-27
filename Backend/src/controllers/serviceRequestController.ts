import { Request, Response } from "express";
import ServiceRequestService from "../services/serviceRequestService";
import { RequestStatus } from "../constants/request-status";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const request = await ServiceRequestService.createRequest(
      req.body,
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

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const request = await ServiceRequestService.updateRequest(
      id,
      req.body
    );

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
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
      assignedTo,          // ✅ ObjectId 
      notes,
      assignedDate,
      urgency,
      status: RequestStatus.ASSIGNED,
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

export const resolveRequest = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { solution } = req.body;

    const request = await ServiceRequestService.resolveRequest(
      id,
      solution
    );

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to resolve request",
      error,
    });
  }
};