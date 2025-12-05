import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { protect } from "../midllewares/authMiddleware";

const router = Router();

router.post("/register",registerUser);
router.post("/login", loginUser);

export default router;
