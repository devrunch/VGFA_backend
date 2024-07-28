import express from "express";
import {
  approvePanchayatRegistration,
  approvePanchayatUpdate,
  rejectPanchayatRegistration,
  rejectPanchayatUpdate,
  approveOfficialRegistration,
  approveOfficialUpdate,
  rejectOfficialRegistration,
  rejectOfficialUpdate
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/approve-panchayat-registration/:email", approvePanchayatRegistration);
router.post("/approve-panchayat-update/:email", approvePanchayatUpdate);
router.post("/reject-panchayat-registration/:email", rejectPanchayatRegistration);
router.post("/reject-panchayat-update/:email", rejectPanchayatUpdate);
router.post("/approve-official-registration/:email",approveOfficialRegistration);
router.post("/approve-official-update/:email",approveOfficialUpdate);
router.post("/reject-official-registration/:email",rejectOfficialRegistration);
router.post("/reject-official-update/:email",rejectOfficialUpdate);

export default router;