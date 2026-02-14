import express from 'express';
import { login, getAdminInfo } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', login);
router.get('/info', authenticateToken, getAdminInfo);

export default router;
