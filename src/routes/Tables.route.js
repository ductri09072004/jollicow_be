import express from "express";
import { getRequests,softRequests,softAllRequests,addRequest,updateTableByIdTable,deleteRequest,softRestaurantRequests} from "../controllers/Tables.controller.js";

const router = express.Router();

router.get("/tables", getRequests);
router.post("/tables", softRequests);
router.post("/tables/checkauth", softAllRequests);
router.post("/tables/create", addRequest);
router.post("/tables/update_table", updateTableByIdTable);
router.delete("/tables/:id", deleteRequest);
router.post("/tables/softbyres", softRestaurantRequests);

// Xuất theo chuẩn ES Module
export default router;
