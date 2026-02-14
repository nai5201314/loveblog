import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getSettings);
router.put('/', authenticateToken, updateSettings);

export default router;
