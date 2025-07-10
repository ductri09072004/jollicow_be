import express from "express";
import { getRequests, softRequests,addRequest,deleteRequest,
    updateRequest,getMenuById,softbyRes3in1Requests,softbyResRequests
} from "../controllers/Menus.controller.js";

const router = express.Router();

//client
router.get("/menus", getRequests);
router.post("/menus", softRequests);
router.post("/menus/create", addRequest);
router.delete("/menus/:id", deleteRequest);
router.put("/menus/:id", updateRequest);
router.post("/menus/byid/:id", getMenuById);
router.post("/menus/byres3in1", softbyRes3in1Requests);
router.post("/menus/byres", softbyResRequests);

//admin
router.get("/admin/menus", getRequests);
router.post("/admin/menus", softRequests);
router.post("/admin/menus/create", addRequest);
router.delete("/admin/menus/:id", deleteRequest);
router.put("/admin/menus/:id", updateRequest);
router.post("/admin/menus/byid/:id", getMenuById);
router.post("/admin/menus/byres3in1", softbyRes3in1Requests);
router.post("/admin/menus/byres", softbyResRequests);


export default router;
