import express from "express";
import { getRequests,addRequest} from "../controllers/Orders.controller.js";

const router = express.Router();

router.get("/orders", getRequests);
router.post("/orders", addRequest);
// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
