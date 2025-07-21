// import express from "express";
// import { getRequests,authenticateUser,addRequest,resetPassword,deleteAccount,addIDResRequest} from "../controllers/Staffs.controller.js";

// const router = express.Router();

// //client
// router.get("/staffs", getRequests);
// router.post("/staffs/auth", authenticateUser);
// router.post("/staffs/register", addRequest);
// router.post("/staffs/reset", resetPassword);
// router.post("/staffs/delete", deleteAccount);
// router.post("/staffs/addID", addIDResRequest);

// //admin
// router.get("/admin/staffs", getRequests);
// router.post("/admin/staffs/auth", authenticateUser);
// router.post("/admin/staffs/register", addRequest);
// router.post("/admin/staffs/reset", resetPassword);
// router.post("/admin/staffs/delete", deleteAccount);
// router.post("/admin/staffs/addID", addIDResRequest);

// // Xuất theo chuẩn ES Module
// export default router;

import express from "express";
import {
  getRequests,
  authenticateUser,
  addRequest,
  resetPassword,
  deleteAccount,
  addIDResRequest,
  getInactiveStaffs,
  putStaffRequest
} from "../controllers/Staffs.controller.js";

const router = express.Router();

// Hàm tái sử dụng route cho staffs
const setupStaffRoutes = (basePath, router) => {
  router.get(basePath, getRequests);
  router.post(`${basePath}/auth`, authenticateUser);
  router.post(`${basePath}/register`, addRequest);
  router.post(`${basePath}/reset`, resetPassword);
  router.post(`${basePath}/delete`, deleteAccount);
  router.post(`${basePath}/addID`, addIDResRequest);
  router.post(`${basePath}/putAcc`, putStaffRequest);
  router.get(`${basePath}/getInactive`, getInactiveStaffs);
};

// Gọi cho cả client và admin
setupStaffRoutes("/staffs", router);
setupStaffRoutes("/admin/staffs", router);

export default router;
