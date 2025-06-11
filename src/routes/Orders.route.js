import express from "express";
import { getRequests,addRequest,fillerbyResRequests,filletbyStatusRequests,updateStatusConfirm,updateStatus} from "../controllers/Orders.controller.js";

const router = express.Router();

router.get("/orders", getRequests);
router.post("/orders", addRequest);
router.post("/orders/fillerid", fillerbyResRequests);
router.post("/orders/fillerstatus", filletbyStatusRequests);
router.put("/orders/update_confirm", updateStatusConfirm);
router.put("/orders/update_status", updateStatus);

// Xuất theo chuẩn ES Module
export default router;
