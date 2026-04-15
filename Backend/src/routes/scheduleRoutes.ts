import express from "express";
import {
  createEvent,
  getMyEvents,
  deleteEvent,
} from "../controllers/scheduleController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getMyEvents);
router.delete("/:id", protect, deleteEvent);

export default router;