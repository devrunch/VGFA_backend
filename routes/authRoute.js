import express from 'express';
const router = express.Router();
import checkAuth from '../middleware/checkAuth.js';
import checkAdmin from '../middleware/checkAdmin.js';
import {
    fetchCurrentUser,
    verifyPhoneOtp,
    handleAdmin,
    createNewUser,
    Login_with_otp
} from "../controllers/authController.js";


router.post("/register", createNewUser);

router.post("/login", Login_with_otp);

router.post("/verify", verifyPhoneOtp);

router.get("/me", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

export default router;