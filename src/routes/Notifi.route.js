import express from "express";
import { getRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Notifi.controller.js";

const router = express.Router();

//client
router.get("/notifis", getRequests);
router.post("/notifis", addRequest);
router.delete("/notifis/:id", deleteRequest);
router.put("/notifis/:id", updateRequest);

//admin
router.get("/admin/notifis", getRequests);
router.post("/admin/notifis", addRequest);
router.delete("/admin/notifis/:id", deleteRequest);
router.put("/admin/notifis/:id", updateRequest);

export default router;
