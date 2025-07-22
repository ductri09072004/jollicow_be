

import express from "express";
import {
  getRequests,
  addRequest,
  countDishesQuantity
} from "../controllers/OrderItems.controller.js";

const router = express.Router();

// Tái sử dụng route cho orderitems
const setupOrderItemsRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(basePath, addRequest);
  router.post(`${basePath}/count-dishes`, countDishesQuantity);
};

// Gọi cho cả client và admin
setupOrderItemsRoutes("/orderitems", router);
setupOrderItemsRoutes("/admin/orderitems", router);

export default router;
