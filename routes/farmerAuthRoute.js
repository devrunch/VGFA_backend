import express from 'express';
const router = express.Router();
import {farmerAuthCheck} from '../middleware/checkAuth.js';

import {
    fetchCurrentUser,
    verifyPhoneOtp,
    createNewFarmer,
    loginFarmer,
    updateFarmer
} from "../controllers/authController.js";


router.post("/register", createNewFarmer);

router.post("/login", loginFarmer);

router.post("/verify", verifyPhoneOtp);

router.get("/me", farmerAuthCheck, fetchCurrentUser);
router.put("/update", farmerAuthCheck, updateFarmer);


export default router;