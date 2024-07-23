import { Router } from "express";

import { register, login, update } from "../controllers/PanchayatController.js";
import { panchayatSignUpValidation,userLoginValidation } from "../middleware/validate.js";

const router = new Router();

router.post("/register", panchayatSignUpValidation, register);
router.post("/login", userLoginValidation, login);
router.post("/update", update);

// @todo! Add auth checker middleware for Panchayat
// router.post("/update", checkAuth ,update);

export default router;
