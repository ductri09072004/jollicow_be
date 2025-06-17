import express from "express";
import { getRequests,addCartRequest,updateCartRequest,deleteRequest,filterCartsByTableAndRestaurant} from "../controllers/Carts.controller.js";

const router = express.Router();

router.get("/carts", getRequests);
router.post("/carts/create", addCartRequest);
router.put("/carts/update/:id", updateCartRequest);
router.delete("/carts/:id", deleteRequest);
router.post("/carts/filter", filterCartsByTableAndRestaurant);

// Xuất theo chuẩn ES Module
export default router;
