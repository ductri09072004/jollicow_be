

import express from "express";
import {
  getRequests,
  softRequests,
  addRequest,
  deleteRequest,
  updateRequest
} from "../controllers/Categories.controller.js";

const router = express.Router();

// Hàm tái sử dụng route cho categories
const setupCategoryRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}`, softRequests);
  router.post(`${basePath}/create`, addRequest);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.put(`${basePath}/:id`, updateRequest);
};

// Áp dụng cho client và admin
setupCategoryRoutes("/categories", router);
setupCategoryRoutes("/admin/categories", router);

export default router;
