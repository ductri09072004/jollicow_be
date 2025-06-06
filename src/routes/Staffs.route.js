import express from "express";
import { getRequests,authenticateUser,addRequest,resetPassword,deleteAccount,addIDResRequest} from "../controllers/Staffs.controller.js";

const router = express.Router();

router.get("/staffs", getRequests);
router.post("/staffs/auth", authenticateUser);
router.post("/staffs/register", addRequest);
router.post("/staffs/reset", resetPassword);
router.post("/staffs/delete", deleteAccount);
router.post("/staffs/addID", addIDResRequest);

// Xuất theo chuẩn ES Module
export default router;
