import express from "express";

const router = express.Router();
import {
    createPaymentUrl,
    vnpayReturnUrl
  } from "../controllers/Vnpay.controller.js";


const setupVnpayRoutes = (basePath, router) => {
    router.post(`${basePath}/create_payment_url`, createPaymentUrl);
    router.get(`${basePath}/vnpay_return`, vnpayReturnUrl);
  };
  
  // Khai báo route cho cả client và admin
  setupVnpayRoutes("/pay", router);
  setupVnpayRoutes("/admin/pay", router);

export default router;