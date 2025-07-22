

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
