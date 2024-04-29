import express from 'express';
const router = express.Router();
import checkAuth from '../middleware/checkAuth.js';

import {
    fetchCurrentUser,
    verifyPhoneOtp,
    createNewFarmer,
    loginFarmer
} from "../controllers/authController.js";


router.post("/register", createNewFarmer);

router.post("/login", loginFarmer);

router.post("/verify", verifyPhoneOtp);

router.get("/me", checkAuth, fetchCurrentUser);


export default router;