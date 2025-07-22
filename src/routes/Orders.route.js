

import express from "express";
import {
  getRequests,
  addRequest,
  fillerbyResRequests,
  filterByStatusRequests,
  updateStatus,
  deleteRequest,
  filter3in1Requests,
  softByResDoneRequests,
  calculateMonthlyRevenueByRestaurant,
  countOrdersByStatus
} from "../controllers/Orders.controller.js";

const router = express.Router();

// Hàm cấu hình route
const setupOrderRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}/revenue`, calculateMonthlyRevenueByRestaurant);
  router.post(`${basePath}`, addRequest);
  router.post(`${basePath}/fillerid`, fillerbyResRequests);
  router.post(`${basePath}/fillerstatus`, filterByStatusRequests);
  router.put(`${basePath}/update_status`, updateStatus);
  router.delete(`${basePath}/deleteall/:id`, deleteRequest);
  router.post(`${basePath}/filler3in1`, filter3in1Requests);
  router.post(`${basePath}/filterresdone`, softByResDoneRequests);
  router.post(`${basePath}/count-status`, countOrdersByStatus);
};

// Khai báo cho cả /orders và /admin/orders
setupOrderRoutes("/orders", router);
setupOrderRoutes("/admin/orders", router);

export default router;
