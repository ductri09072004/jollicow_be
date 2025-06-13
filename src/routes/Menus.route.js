import express from "express";
import { getRequests, softRequests,addRequest} from "../controllers/Menus.controller.js";

const router = express.Router();

router.get("/menus", getRequests);
router.post("/menus", softRequests);
router.post("/menus/create", addRequest);

// router.delete("/account/:id", deleteRequest);
// router.put("/account/:id", updateRequest);
// Xuất theo chuẩn ES Module
export default router;
