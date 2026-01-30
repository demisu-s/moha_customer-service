import { Router } from "express";
import { registerUser, loginUser,getUsers,deleteUser,updateUser } from "../controllers/authController";
import { upload } from "../midllewares/upload";

const router = Router();

router.post("/register", upload.single("photo"), registerUser);
router.post("/login", loginUser);
router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id",deleteUser);
router.put("/updateUser/:id",updateUser);

export default router;
