import { Router } from "express";
import { panchayatAuthCheck } from "../middleware/checkAuth.js";
import { register, login, update } from "../controllers/PanchayatController.js";
import {
  panchayatSignUpValidation,
  userLoginValidation,
} from "../middleware/validate.js";

const router = new Router();

router.post("/register", panchayatSignUpValidation, register);
router.post("/login", userLoginValidation, login);
router.post("/update", panchayatAuthCheck, update);

// @todo! Add auth checker middleware for Panchayat
// router.post("/update", checkAuth ,update);

export default router;
