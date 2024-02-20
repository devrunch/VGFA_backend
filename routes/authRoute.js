import express from 'express';
const router = express.Router();
import checkAuth from '../middleware/checkAuth.js';
import checkAdmin from '../middleware/checkAdmin.js';
import {
    fetchCurrentUser,
    loginWithPhoneOtp,
    verifyPhoneOtp,
    handleAdmin,
    createNewUser,
    loginOtp
} from "../controllers/authController.js";


router.post("/register", createNewUser);

router.post("/login_with_phone", loginWithPhoneOtp);
router.post("/loginotp", loginOtp);


router.post("/verify", verifyPhoneOtp);

router.get("/me", checkAuth, fetchCurrentUser);

router.get("/admin", checkAuth, checkAdmin, handleAdmin);

export default router;