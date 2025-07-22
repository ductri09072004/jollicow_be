

import express from "express";
import {
  getRequests,
  addCartRequest,
  updateCartRequest,
  deleteRequest,
  filterCartsByTableAndRestaurant,
  createOrderFromCart
} from "../controllers/Carts.controller.js";

const router = express.Router();

// Hàm cấu hình route carts
const setupCartRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}/create`, addCartRequest);
  router.put(`${basePath}/update/:id`, updateCartRequest);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.post(`${basePath}/filter`, filterCartsByTableAndRestaurant);
  router.post(`${basePath}/createALL`, createOrderFromCart);
};

// Khai báo route cho cả client và admin
setupCartRoutes("/carts", router);
setupCartRoutes("/admin/carts", router);

export default router;
