

import express from "express";
import {
  getRequests,
  softRequests,
  softAllRequests,
  addRequest,
  updateTableByIdTable,
  deleteRequest,
  softRestaurantRequests
} from "../controllers/Tables.controller.js";

const router = express.Router();

// Tái sử dụng routes cho tables
const setupTableRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(basePath, softRequests);
  router.post(`${basePath}/checkauth`, softAllRequests);
  router.post(`${basePath}/create`, addRequest);
  router.post(`${basePath}/update_table`, updateTableByIdTable);
  router.delete(`${basePath}/:id`, deleteRequest);
  router.post(`${basePath}/softbyres`, softRestaurantRequests);
};

// Gọi cho cả client và admin
setupTableRoutes("/tables", router);
setupTableRoutes("/admin/tables", router);

export default router;
