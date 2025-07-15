// import express from "express";
// import { getToppings,createTopping,
//     filterToppingsByDishId,deleteRequest,updateNameDetailRequest,
//     deleteOptionRequest,updateOptionRequest} from "../controllers/Topping.controller.js";

// const router = express.Router();

// //client
// router.get("/toppings", getToppings);
// router.post("/toppings", createTopping);
// router.post("/toppings/filter", filterToppingsByDishId);
// router.delete("/toppings/:id", deleteRequest);
// router.put("/toppings/namedetail/:id", updateNameDetailRequest);
// router.delete("/toppings/option/:id", deleteOptionRequest);
// router.put("/toppings/option/:id", updateOptionRequest);

// //admin
// router.get("/admin/toppings", getToppings);
// router.post("/admin/toppings", createTopping);
// router.post("/admin/toppings/filter", filterToppingsByDishId);
// router.delete("/admin/toppings/:id", deleteRequest);
// router.put("/admin/toppings/namedetail/:id", updateNameDetailRequest);
// router.delete("/admin/toppings/option/:id", deleteOptionRequest);
// router.put("/admin/toppings/option/:id", updateOptionRequest);
// // Xuất theo chuẩn ES Module
// export default router;

import express from "express";
import {
  getToppings,
  createTopping,
  filterToppingsByDishId,
  deleteRequest,
  updateNameDetailRequest,
  deleteOptionRequest,
  updateOptionRequest
} from "../controllers/Topping.controller.js";

const router = express.Router();

// Tái sử dụng routes cho toppings
const setupToppingRoutes = (basePath, router) => {
  router.get(basePath, getToppings);
  router.post(basePath, createTopping);
  router.post(`${basePath}/filter`, filterToppingsByDishId);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.put(`${basePath}/namedetail/:id`, updateNameDetailRequest);
  router.delete(`${basePath}/option/:id`, deleteOptionRequest);
  router.put(`${basePath}/option/:id`, updateOptionRequest);
};

// Gọi cho client và admin
setupToppingRoutes("/toppings", router);
setupToppingRoutes("/admin/toppings", router);

export default router;
