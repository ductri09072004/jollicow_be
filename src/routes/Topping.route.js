import express from "express";
import { getToppings,createTopping,filterToppingsByDishId} from "../controllers/Topping.controller.js";

const router = express.Router();

router.get("/toppings", getToppings);
router.post("/toppings", createTopping);
router.post("/toppings/filter", filterToppingsByDishId);

// Xuất theo chuẩn ES Module
export default router;
