import express from "express";
import { getRequests, softRequests,addRequest,deleteRequest,updateRequest,getMenuById,softbyRes3in1Requests,softbyResRequests} from "../controllers/Menus.controller.js";

const router = express.Router();

router.get("/menus", getRequests);
router.post("/menus", softRequests);
router.post("/menus/create", addRequest);
router.delete("/menus/:id", deleteRequest);
router.put("/menus/:id", updateRequest);
router.post("/menus/byid/:id", getMenuById);
router.post("/menus/byres3in1", softbyRes3in1Requests);
router.post("/menus/byres", softbyResRequests);

// Xuất theo chuẩn ES Module
export default router;
