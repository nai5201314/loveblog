import express from 'express';
import {
  getTimes,
  getTimeById,
  createTime,
  updateTime,
  deleteTime
} from '../controllers/timeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getTimes);
router.get('/:id', getTimeById);
router.post('/', authenticateToken, createTime);
router.put('/:id', authenticateToken, updateTime);
router.delete('/:id', authenticateToken, deleteTime);

export default router;
