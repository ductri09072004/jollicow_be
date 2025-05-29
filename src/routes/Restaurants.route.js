import express from "express";
import { getRequests,addRequest} from "../controllers/Restaurants.controller.js";

const router = express.Router();

router.get("/restaurants", getRequests);
router.post("/restaurants", addRequest);
// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
