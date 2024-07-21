import express from "express";
const router = express.Router();
import { farmerAuthCheck } from "../middleware/checkAuth.js";
import { isFarmerExistCheck } from "../middleware/checks.js";
import { signUpValidation, loginValidation, verifyOtpValidation } from "../middleware/validate.js";
import {
  fetchCurrentUser,
  verifyPhoneOtp,
  createNewFarmer,
  loginFarmer,
  updateFarmer,
  checkMissingFields,
} from "../controllers/authController.js";
import upload from "../middleware/multer.js";

router.post(
  "/register",
  signUpValidation,
  isFarmerExistCheck,
  upload,
  createNewFarmer
);

router.post("/login", loginValidation, loginFarmer);
// router.post("updateProfilePic",upload,updateProfilePic);
router.post("/verify", verifyOtpValidation, verifyPhoneOtp);

router.get("/me", farmerAuthCheck, fetchCurrentUser);
router.put("/update", farmerAuthCheck, upload, updateFarmer);
router.get("/status", farmerAuthCheck, checkMissingFields);

export default router;
