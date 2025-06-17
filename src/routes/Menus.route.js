import express from "express";
import { getRequests, softRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Menus.controller.js";

const router = express.Router();

router.get("/menus", getRequests);
router.post("/menus", softRequests);
router.post("/menus/create", addRequest);
router.delete("/menus/:id", deleteRequest);
router.put("/menus/:id", updateRequest);

// Xuất theo chuẩn ES Module
export default router;
