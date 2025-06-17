import express from "express";
import { getRequests,addCartRequest,updateCartRequest,deleteRequest,filterCartsByTableAndRestaurant,createOrderFromCart} from "../controllers/Carts.controller.js";

const router = express.Router();

router.get("/carts", getRequests);
router.post("/carts/create", addCartRequest);
router.put("/carts/update/:id", updateCartRequest);
router.delete("/carts/:id", deleteRequest);
router.post("/carts/filter", filterCartsByTableAndRestaurant);
router.post("/carts/createALL", createOrderFromCart);
// Xuất theo chuẩn ES Module
export default router;
