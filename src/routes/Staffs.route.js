import express from "express";
import { getRequests,authenticateUser,addRequest,resetPassword,deleteAccount,addIDResRequest} from "../controllers/Staffs.controller.js";

const router = express.Router();

//client
router.get("/staffs", getRequests);
router.post("/staffs/auth", authenticateUser);
router.post("/staffs/register", addRequest);
router.post("/staffs/reset", resetPassword);
router.post("/staffs/delete", deleteAccount);
router.post("/staffs/addID", addIDResRequest);

//admin
router.get("/admin/staffs", getRequests);
router.post("/admin/staffs/auth", authenticateUser);
router.post("/admin/staffs/register", addRequest);
router.post("/admin/staffs/reset", resetPassword);
router.post("/admin/staffs/delete", deleteAccount);
router.post("/admin/staffs/addID", addIDResRequest);

// Xuất theo chuẩn ES Module
export default router;
