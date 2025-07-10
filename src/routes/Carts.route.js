import express from "express";
import { getRequests,addCartRequest,updateCartRequest,deleteRequest,filterCartsByTableAndRestaurant,createOrderFromCart} from "../controllers/Carts.controller.js";

const router = express.Router();

//client
router.get("/carts", getRequests);
router.post("/carts/create", addCartRequest);
router.put("/carts/update/:id", updateCartRequest);
router.delete("/carts/:id", deleteRequest);
router.post("/carts/filter", filterCartsByTableAndRestaurant);
router.post("/carts/createALL", createOrderFromCart);

//admin
router.get("/admin/carts", getRequests);
router.post("/admin/carts/create", addCartRequest);
router.put("/admin/carts/update/:id", updateCartRequest);
router.delete("/admin/carts/:id", deleteRequest);
router.post("/admin/carts/filter", filterCartsByTableAndRestaurant);
router.post("/admin/carts/createALL", createOrderFromCart);

// Xuất theo chuẩn ES Module
export default router;
