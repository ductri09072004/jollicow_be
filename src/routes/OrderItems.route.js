// import express from "express";
// import { getRequests,addRequest} from "../controllers/OrderItems.controller.js";

// const router = express.Router();

// //client
// router.get("/orderitems", getRequests);
// router.post("/orderitems", addRequest);

// //admin
// router.get("/admin/orderitems", getRequests);
// router.post("/admin/orderitems", addRequest);

// // Xuất theo chuẩn ES Module
// export default router;

import express from "express";
import {
  getRequests,
  addRequest
} from "../controllers/OrderItems.controller.js";

const router = express.Router();

// Tái sử dụng route cho orderitems
const setupOrderItemsRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(basePath, addRequest);
};

// Gọi cho cả client và admin
setupOrderItemsRoutes("/orderitems", router);
setupOrderItemsRoutes("/admin/orderitems", router);

export default router;
