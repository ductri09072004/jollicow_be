import express from "express";
import { getRequests,addRequest,fillerbyResRequests,filterByStatusRequests,updateStatus,deleteRequest} from "../controllers/Orders.controller.js";

const router = express.Router();

router.get("/orders", getRequests);
router.post("/orders", addRequest);
router.post("/orders/fillerid", fillerbyResRequests);
router.post("/orders/fillerstatus", filterByStatusRequests);
router.put("/orders/update_status", updateStatus);
router.delete("/orders/deleteall/:id", deleteRequest);

// Xuất theo chuẩn ES Module
export default router;
