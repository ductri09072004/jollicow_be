import express from "express";
import { getRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Notifi.controller.js";

const router = express.Router();

router.get("/notifis", getRequests);
router.post("/notifis", addRequest);
router.delete("/notifis/:id", deleteRequest);
router.put("/notifis/:id", updateRequest);

export default router;
