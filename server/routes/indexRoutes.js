import express from 'express';
import { getHomeData, getTogetherDays } from '../controllers/indexController.js';

const router = express.Router();
router.get('/api/home', getHomeData);
router.get('/api/together-days', getTogetherDays);

export default router;
