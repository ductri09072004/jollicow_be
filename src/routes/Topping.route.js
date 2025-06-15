import express from "express";
import { getToppings,createTopping,
    filterToppingsByDishId,deleteRequest,updateNameDetailRequest,
    deleteOptionRequest,updateOptionRequest} from "../controllers/Topping.controller.js";

const router = express.Router();

router.get("/toppings", getToppings);
router.post("/toppings", createTopping);
router.post("/toppings/filter", filterToppingsByDishId);
router.delete("/toppings/:id", deleteRequest);
router.put("/toppings/namedetail/:id", updateNameDetailRequest);
router.delete("/toppings/option/:id", deleteOptionRequest);
router.put("/toppings/option/:id", updateOptionRequest);

// Xuất theo chuẩn ES Module
export default router;
