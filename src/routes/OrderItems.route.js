import express from "express";
import { getRequests,addRequest} from "../controllers/OrderItems.controller.js";

const router = express.Router();

router.get("/orderitems", getRequests);
router.post("/orderitems", addRequest);
// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
