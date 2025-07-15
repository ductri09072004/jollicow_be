// import express from "express";
// import { getRequests,addCartRequest,updateCartRequest,deleteRequest,filterCartsByTableAndRestaurant,createOrderFromCart} from "../controllers/Carts.controller.js";

// const router = express.Router();

// //client
// router.get("/carts", getRequests);
// router.post("/carts/create", addCartRequest);
// router.put("/carts/update/:id", updateCartRequest);
// router.delete("/carts/:id", deleteRequest);
// router.post("/carts/filter", filterCartsByTableAndRestaurant);
// router.post("/carts/createALL", createOrderFromCart);

// //admin
// router.get("/admin/carts", getRequests);
// router.post("/admin/carts/create", addCartRequest);
// router.put("/admin/carts/update/:id", updateCartRequest);
// router.delete("/admin/carts/:id", deleteRequest);
// router.post("/admin/carts/filter", filterCartsByTableAndRestaurant);
// router.post("/admin/carts/createALL", createOrderFromCart);

// // Xuất theo chuẩn ES Module
// export default router;

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
