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
import parseFormData from "../middleware/multerNone.js";

const router = express.Router();

router.get("/me", officialAuthCheck, Profile);
router.post("/login", parseFormData, userLoginValidation, Login);
router.post("/register", upload, officialSignUpValidation, Register);
router.post("/update", officialAuthCheck, upload, update);
router.get("/all", getAll);
router.get("/get/:filter", getById);

export default router;
