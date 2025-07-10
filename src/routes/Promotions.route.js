import express from "express";
import { getRequests} from "../controllers/Promotions.controller.js";

const router = express.Router();

//client
router.get("/promotions", getRequests);

//admin
router.get("/admin/promotions", getRequests);

// Xuất theo chuẩn ES Module
export default router;
