import express from "express";
import { getRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Restaurants.controller.js";

const router = express.Router();

router.get("/restaurants", getRequests);
router.post("/restaurants", addRequest);
router.delete("/restaurants/:id", deleteRequest);
router.put("/restaurants/:id", updateRequest);

// Xuất theo chuẩn ES Module
export default router;
