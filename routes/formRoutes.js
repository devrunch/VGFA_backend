import express from 'express';
import { getForm,createForm } from '../controllers/formController.js';
import { farmerAuthCheck } from '../middleware/checkAuth.js';
const router = express.Router();


// Define your routes here
router.get('/', getForm);
router.post('/create',farmerAuthCheck,createForm)

export default router;