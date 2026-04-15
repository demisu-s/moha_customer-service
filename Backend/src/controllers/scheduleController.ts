import { Request, Response } from "express";
import ScheduleService from "../services/scheduleService";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    department?: {
      plant?: string | { _id: string };
    };
  };
}
export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const events = await ScheduleService.createEvent(
      req.body,
      userId!
    );

    res.status(201).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
      error,
    });
  }
};

export const getMyEvents = async (req: AuthRequest, res: Response) => {
  try {
    const events = await ScheduleService.getEvents(); // ✅ FIXED

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
      error,
    });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ❌ BLOCK SUPERVISOR
    if (user.role === "supervisor") {
      return res.status(403).json({
        message: "You are not allowed to delete schedules",
      });
    }

    const event = await ScheduleService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ADMIN → ONLY SAME PLANT
    if (user.role === "admin") {
      const userPlant =
        typeof user.department?.plant === "string"
          ? user.department.plant
          : user.department?.plant?._id;

      if (event.plant.toString() !== userPlant) {
        return res.status(403).json({
          message: "You can only delete your plant schedules",
        });
      }
    }

    // SUPERADMIN → allowed (no restriction)

    await ScheduleService.deleteEvent(eventId);

    return res.json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete event",
      error,
    });
  }
};