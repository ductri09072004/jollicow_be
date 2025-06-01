import express from "express";
import { getRequests,softRequests} from "../controllers/Categories.controller.js";

const router = express.Router();

router.get("/categories", getRequests);
router.post("/categories", softRequests);
// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
