

import express from "express";
import {
  getRequests,
  getPromotionsByRestaurant,
  updatePromotion,
  addPromotion,
  deletePromotion,
  calculateDiscountFromPromotion
} from "../controllers/Promotions.controller.js";

const router = express.Router();

// Hàm tái sử dụng cho promotions
const setupPromotionRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(basePath, getPromotionsByRestaurant);
  router.put(`${basePath}/:id`, updatePromotion);
  router.post(`${basePath}/create`, addPromotion);
  router.delete(`${basePath}/:id`, deletePromotion);
  router.post(`${basePath}/calculate`, calculateDiscountFromPromotion);
};

// Gọi cho client và admin
setupPromotionRoutes("/promotions", router);
setupPromotionRoutes("/admin/promotions", router);

export default router;
