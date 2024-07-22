import { Router } from "express";

import { register, login, update } from "../controllers/PanchayatController.js";

const router = new Router();

router.post("/register", register);
router.post("/login", login);

// @todo! Add auth checker middleware for Panchayat
// router.post("/update", checkAuth ,update);

export default router;