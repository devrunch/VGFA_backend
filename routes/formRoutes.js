import express from "express";
import { getForm, createForm, getAllForms, updateForm } from "../controllers/formController.js";
import { farmerAuthCheck, officialAuthCheck } from "../middleware/checkAuth.js";
import parseFormData from "../middleware/multerNone.js";

const router = express.Router();

router.get("/", farmerAuthCheck, parseFormData, getForm);
router.post("/create", farmerAuthCheck, parseFormData, createForm);
router.get("/all", officialAuthCheck, parseFormData, getAllForms);
router.post("/update", officialAuthCheck, parseFormData, updateForm);

export default router;
