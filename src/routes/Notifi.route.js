

import express from "express";
import {
  getRequests,
  addRequest,
  deleteRequest,
  updateRequest
} from "../controllers/Notifi.controller.js";

const router = express.Router();

// Tái sử dụng route cho notifis
const setupNotifiRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}`, addRequest);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.put(`${basePath}/:id`, updateRequest);
};

// Gọi cho cả client và admin
setupNotifiRoutes("/notifis", router);
setupNotifiRoutes("/admin/notifis", router);

export default router;
