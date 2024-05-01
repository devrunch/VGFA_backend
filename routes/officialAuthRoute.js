import express from "express";
import { Login,Register,Profile } from "../controllers/officialAuthController.js";  
import { officialAuthCheck } from "../middleware/checkAuth.js";

const router = express.Router();
router.get("/me",officialAuthCheck, Profile)
router.post("/login", Login);
router.post('/register', Register)
export default router;
