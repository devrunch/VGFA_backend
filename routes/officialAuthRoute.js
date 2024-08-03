import express from "express";
import {
  Login,
  Register,
  Profile,
  update,
  getAll,
  getById
} from "../controllers/officialAuthController.js";
import { officialAuthCheck } from "../middleware/checkAuth.js";
import {
  officialSignUpValidation,
  userLoginValidation,
} from "../middleware/validate.js";
import upload from "../middleware/multerOfficial.js";

const router = express.Router();

router.get("/me", officialAuthCheck, Profile);
router.post("/login", userLoginValidation, Login);
router.post("/register", officialSignUpValidation, Register);
router.post("/update", officialAuthCheck, upload, update);
router.get("/all", getAll);
router.get("/get/:filter", getById);

export default router;
