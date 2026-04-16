import express from "express";
import {
  createEvent,
  getMyEvents,
  deleteEvent,
} from "../controllers/scheduleController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/createEvent", protect, createEvent);
router.get("/myEvents", getMyEvents);
router.delete("/deleteEvent/:id", protect, deleteEvent);

export default router;