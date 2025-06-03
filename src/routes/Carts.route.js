import express from "express";
import { getRequests} from "../controllers/Carts.controller.js";

const router = express.Router();

router.get("/carts", getRequests);


// Xuất theo chuẩn ES Module
export default router;
