import { Router } from "express";

import { register } from "../controllers/PanchayatController.js";

const router = new Router();

router.post("/register", register);

export default router;