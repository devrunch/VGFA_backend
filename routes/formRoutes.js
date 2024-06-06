import express from 'express';
import { getForm,createForm,getAllForms, updateForm } from '../controllers/formController.js';
import { farmerAuthCheck,officialAuthCheck } from '../middleware/checkAuth.js';
const router = express.Router();


// Define your routes here
router.get('/',farmerAuthCheck, getForm);
router.post('/create',farmerAuthCheck,createForm)
router.get('/all',officialAuthCheck, getAllForms);
router.post('/update',officialAuthCheck,updateForm)

export default router;