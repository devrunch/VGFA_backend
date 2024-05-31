import express from 'express';
import { getFarmer,getFarmerByTag,getFarmers } from '../controllers/communityController.js';

const router = express.Router();

router.get('/', getFarmers);
router.get('/phone', getFarmer);
router.get('/tag', getFarmerByTag);

export default router; 