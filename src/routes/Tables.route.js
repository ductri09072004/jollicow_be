// import express from "express";
// import { getRequests,softRequests,softAllRequests,addRequest,updateTableByIdTable,deleteRequest,softRestaurantRequests} from "../controllers/Tables.controller.js";

// const router = express.Router();

// //client
// router.get("/tables", getRequests);
// router.post("/tables", softRequests);
// router.post("/tables/checkauth", softAllRequests);
// router.post("/tables/create", addRequest);
// router.post("/tables/update_table", updateTableByIdTable);
// router.delete("/tables/:id", deleteRequest);
// router.post("/tables/softbyres", softRestaurantRequests);

// //admin
// router.get("/admin/tables", getRequests);
// router.post("/admin/tables", softRequests);
// router.post("/admin/tables/checkauth", softAllRequests);
// router.post("/admin/tables/create", addRequest);
// router.post("/admin/tables/update_table", updateTableByIdTable);
// router.delete("/admin/tables/:id", deleteRequest);
// router.post("/admin/tables/softbyres", softRestaurantRequests);

// // Xuất theo chuẩn ES Module
// export default router;

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
