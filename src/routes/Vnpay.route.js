import express from "express";

const router = express.Router();
import {
    createPaymentUrl,
    vnpayReturnUrl,
    debugVnpayHash
  } from "../controllers/Vnpay.controller.js";


const setupVnpayRoutes = (basePath, router) => {
    router.post(`${basePath}/create_payment_url`, createPaymentUrl);
    router.get(`${basePath}/vnpay_return`, vnpayReturnUrl);
    router.post(`${basePath}/debug_vnpay_hash`, debugVnpayHash);
  };
  
  // Khai báo route cho cả client và admin
  setupVnpayRoutes("/pay", router);
  setupVnpayRoutes("/admin/pay", router);

export default router;