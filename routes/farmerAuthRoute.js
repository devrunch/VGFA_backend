import express from 'express';
const router = express.Router();
import { farmerAuthCheck } from '../middleware/checkAuth.js';
import { isFarmerExistCheck } from '../middleware/checks.js';
import {
    fetchCurrentUser,
    verifyPhoneOtp,
    createNewFarmer,
    loginFarmer,
    updateFarmer, 
    checkMissingFields
} from "../controllers/authController.js";
import upload from '../middleware/multer.js';


router.post("/register",isFarmerExistCheck, upload ,createNewFarmer);

router.post("/login", loginFarmer);
// router.post("updateProfilePic",upload,updateProfilePic);
router.post("/verify", verifyPhoneOtp);

router.get("/me", farmerAuthCheck, fetchCurrentUser);
router.put("/update", farmerAuthCheck, upload, updateFarmer);
router.get('/status', farmerAuthCheck, checkMissingFields)

export default router;