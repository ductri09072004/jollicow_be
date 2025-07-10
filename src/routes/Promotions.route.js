import express from "express";
import { getRequests} from "../controllers/Promotions.controller.js";

const router = express.Router();

router.get("/promotions", getRequests);

// Xuất theo chuẩn ES Module
export default router;
