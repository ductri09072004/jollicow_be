

import express from "express";
import {
  getRequests,
  softRequests,
  addRequest,
  deleteRequest,
  updateRequest,
  getMenuById,
  softbyRes3in1Requests,
  softbyResRequests
} from "../controllers/Menus.controller.js";

const router = express.Router();

// Hàm tạo route cho menus
const setupMenuRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}`, softRequests);
  router.post(`${basePath}/create`, addRequest);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.put(`${basePath}/:id`, updateRequest);
  router.post(`${basePath}/byid/:id`, getMenuById);
  router.post(`${basePath}/byres3in1`, softbyRes3in1Requests);
  router.post(`${basePath}/byres`, softbyResRequests);
};

// Gọi cho cả client và admin
setupMenuRoutes("/menus", router);
setupMenuRoutes("/admin/menus", router);

export default router;
