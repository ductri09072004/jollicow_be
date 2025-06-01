import express from "express";
import { getRequests,softRequests} from "../controllers/Tables.controller.js";

const router = express.Router();

router.get("/tables", getRequests);
router.post("/tables", softRequests);
// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
