import express from "express";
import { getRequests,softRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Categories.controller.js";

const router = express.Router();

router.get("/categories", getRequests);
router.post("/categories", softRequests);
router.post("/categories/create", addRequest);
router.delete("/categories/:id", deleteRequest);
router.put("/categories/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
