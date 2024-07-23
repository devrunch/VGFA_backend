import express from "express";
import {
  Login,
  Register,
  Profile,
} from "../controllers/officialAuthController.js";
import { officialAuthCheck } from "../middleware/checkAuth.js";
import {
  officialSignUpValidation,
  userLoginValidation,
} from "../middleware/validate.js";

const router = express.Router();
router.get("/me", officialAuthCheck, Profile);
router.post("/login", userLoginValidation, Login);
router.post("/register", officialSignUpValidation, Register);
export default router;
