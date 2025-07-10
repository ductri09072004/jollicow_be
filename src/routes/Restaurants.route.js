import express from "express";
import { getRequests,addRequest,deleteRequest,updateRequest,updateIPRequest} from "../controllers/Restaurants.controller.js";

const router = express.Router();

//client
router.get("/restaurants", getRequests);
router.post("/restaurants", addRequest);
router.delete("/restaurants/:id", deleteRequest);
router.put("/restaurants/:id", updateRequest);
router.post("/restaurants/IP", updateIPRequest);

//admin
router.get("/admin/restaurants", getRequests);
router.post("/admin/restaurants", addRequest);
router.delete("/admin/restaurants/:id", deleteRequest);
router.put("/admin/restaurants/:id", updateRequest);
router.post("/admin/restaurants/IP", updateIPRequest);

// Xuất theo chuẩn ES Module
export default router;
