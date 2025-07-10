import express from "express";
import { getRequests,addRequest,fillerbyResRequests,filterByStatusRequests,updateStatus,deleteRequest,filter3in1Requests,softByResDoneRequests} from "../controllers/Orders.controller.js";

const router = express.Router();

//client
router.get("/orders", getRequests);
router.post("/orders", addRequest);
router.post("/orders/fillerid", fillerbyResRequests);
router.post("/orders/fillerstatus", filterByStatusRequests);
router.put("/orders/update_status", updateStatus);
router.delete("/orders/deleteall/:id", deleteRequest);
router.post("/orders/filler3in1",filter3in1Requests );
router.post("/orders/filterresdone", softByResDoneRequests);

//admin
router.get("/admin/orders", getRequests);
router.post("/admin/orders", addRequest);
router.post("/admin/orders/fillerid", fillerbyResRequests);
router.post("/admin/orders/fillerstatus", filterByStatusRequests);
router.put("/admin/orders/update_status", updateStatus);
router.delete("/admin/orders/deleteall/:id", deleteRequest);
router.post("/admin/orders/filler3in1",filter3in1Requests );
router.post("/admin/orders/filterresdone", softByResDoneRequests);

// Xuất theo chuẩn ES Module
export default router;
