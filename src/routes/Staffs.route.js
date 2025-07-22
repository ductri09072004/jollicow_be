

import express from "express";
import {
  getRequests,
  authenticateUser,
  addRequest,
  resetPassword,
  deleteAccount,
  addIDResRequest,
  getInactiveStaffs,
  fixStaffStatus
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
  router.post(`${basePath}/fixStatus`, fixStaffStatus);
  router.get(`${basePath}/getInactive`, getInactiveStaffs);
};

// Gọi cho cả client và admin
setupStaffRoutes("/staffs", router);
setupStaffRoutes("/admin/staffs", router);

export default router;
