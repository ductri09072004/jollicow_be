
import express from "express";
import {
  getRequests,
  increaseVisitCount,
  getTotalVisits
} from "../controllers/Track.controller.js";

const router = express.Router();

// Hàm cấu hình route track
const setupTrackRoutes = (basePath, router) => {
  router.get(`${basePath}`, getRequests);
  router.post(`${basePath}/increase`, increaseVisitCount);
  router.get(`${basePath}/total`, getTotalVisits);
};

// Khai báo route cho cả client và admin
setupTrackRoutes("/track", router);
setupTrackRoutes("/admin/track", router);

export default router;
