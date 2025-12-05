import { Router } from "express";
import { createRequest, updateSeviceRequest, getServiceRequestById, getServiceRequests, deleteRequest } from "../controllers/serviceRequestController";

const router = Router();

router.post("/createRequest",createRequest);
router.put("/updateRequest", updateSeviceRequest);
router.get("/getRequestById/:id", getServiceRequestById);
router.get("/getRequest", getServiceRequests);
router.delete("/deleteRequest/:id", deleteRequest);


export default router;
