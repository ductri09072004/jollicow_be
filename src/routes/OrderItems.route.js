import express from "express";
import { getRequests,addRequest} from "../controllers/OrderItems.controller.js";

const router = express.Router();

//client
router.get("/orderitems", getRequests);
router.post("/orderitems", addRequest);

//admin
router.get("/admin/orderitems", getRequests);
router.post("/admin/orderitems", addRequest);

// Xuất theo chuẩn ES Module
export default router;
