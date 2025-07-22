

import express from "express";
import {
  getRequests,
  addRequest,
  deleteRequest,
  updateRequest,
  updateIPRequest,
  getIPByRestaurantId
} from "../controllers/Restaurants.controller.js";

const router = express.Router();

// Tái sử dụng route cho restaurants
const setupRestaurantRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(basePath, addRequest);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.put(`${basePath}/:id`, updateRequest);
  router.post(`${basePath}/IP`, updateIPRequest);
  router.post(`${basePath}/GetIP`, getIPByRestaurantId);
};

// Gọi cho cả client và admin
setupRestaurantRoutes("/restaurants", router);
setupRestaurantRoutes("/admin/restaurants", router);

export default router;
