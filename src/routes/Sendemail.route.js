

import express from "express";
import {
  sendEmail,
  sendOTPEmail
} from "../controllers/Sendemail.controller.js";

const router = express.Router();

// Tái sử dụng route cho restaurants
const setupSendEmailRoutes = (basePath, router) => {
  router.post(basePath, sendEmail);
  router.post(`${basePath}/otp`, sendOTPEmail);
};

// Gọi cho cả client và admin
setupSendEmailRoutes("/send", router);
setupSendEmailRoutes("/admin/send", router);

export default router;
