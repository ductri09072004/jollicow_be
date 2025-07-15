// import express from "express";
// import { getRequests,softRequests,addRequest,deleteRequest,updateRequest} from "../controllers/Categories.controller.js";

// const router = express.Router();

// //client
// router.get("/categories", getRequests);
// router.post("/categories", softRequests);
// router.post("/categories/create", addRequest);
// router.delete("/categories/:id", deleteRequest);
// router.put("/categories/:id", updateRequest);

// //admin
// router.get("/admin/categories", getRequests);
// router.post("/admin/categories", softRequests);
// router.post("/admin/categories/create", addRequest);
// router.delete("/admin/categories/:id", deleteRequest);
// router.put("/admin/categories/:id", updateRequest);

// // Xuất theo chuẩn ES Module
// export default router;

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
