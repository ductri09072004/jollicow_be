import express from "express";
import { getRequests,softRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Categories.controller.js";

const router = express.Router();

//client
router.get("/categories", getRequests);
router.post("/categories", softRequests);
router.post("/categories/create", addRequest);
router.delete("/categories/:id", deleteRequest);
router.put("/categories/:id", updateRequest);

//admin
router.get("/admin/categories", getRequests);
router.post("/admin/categories", softRequests);
router.post("/admin/categories/create", addRequest);
router.delete("/admin/categories/:id", deleteRequest);
router.put("/admin/categories/:id", updateRequest);

// Xuất theo chuẩn ES Module
export default router;
