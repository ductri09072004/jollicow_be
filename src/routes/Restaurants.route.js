// import express from "express";
// import { getRequests,addRequest,deleteRequest,updateRequest,updateIPRequest,getIPByRestaurantId} from "../controllers/Restaurants.controller.js";

// const router = express.Router();

// //client
// router.get("/restaurants", getRequests);
// router.post("/restaurants", addRequest);
// router.delete("/restaurants/:id", deleteRequest);
// router.put("/restaurants/:id", updateRequest);
// router.post("/restaurants/IP", updateIPRequest);
// router.post("/restaurants/GetIP", getIPByRestaurantId);

// //admin
// router.get("/admin/restaurants", getRequests);
// router.post("/admin/restaurants", addRequest);
// router.delete("/admin/restaurants/:id", deleteRequest);
// router.put("/admin/restaurants/:id", updateRequest);
// router.post("/admin/restaurants/IP", updateIPRequest);
// router.post("/admin/restaurants/GetIP", getIPByRestaurantId);

// // Xuất theo chuẩn ES Module
// export default router;

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
