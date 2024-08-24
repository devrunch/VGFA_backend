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
import parseFormData from "../middleware/multerNone.js";

router.post(
  "/register",
  parseFormData,
  signUpValidation,
  isFarmerExistCheck,
  // upload,
  createNewFarmer
);

router.post("/login", parseFormData, loginValidation, loginFarmer);
// router.post("updateProfilePic",upload,updateProfilePic);
router.post("/verify", parseFormData, verifyOtpValidation, verifyPhoneOtp);

router.get("/me", farmerAuthCheck, parseFormData, fetchCurrentUser);
router.put("/update", farmerAuthCheck, upload, updateFarmer);
router.get("/status", farmerAuthCheck, parseFormData, checkMissingFields);

export default router;
