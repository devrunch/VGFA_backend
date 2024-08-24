import { Router } from "express";
import { panchayatAuthCheck } from "../middleware/checkAuth.js";
import {
  register,
  login,
  update,
  getAll,
  getById,
  getSelf,
} from "../controllers/PanchayatController.js";
import {
  panchayatSignUpValidation,
  userLoginValidation,
} from "../middleware/validate.js";
import upload from "../middleware/multerPanchayat.js";
import parseFormData from "../middleware/multerNone.js";

const router = new Router();

router.get("/me", panchayatAuthCheck, getSelf);
router.post("/register", parseFormData, panchayatSignUpValidation, register);
router.post("/login", parseFormData, userLoginValidation, login);
router.post("/update", panchayatAuthCheck, upload, update);
router.get("/all", getAll);
router.get("/get/:filter", getById);

// @todo! Add auth checker middleware for Panchayat
// router.post("/update", checkAuth ,update);

export default router;
