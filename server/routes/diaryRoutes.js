import express from 'express';
import {
  getDiaries,
  getDiaryById,
  createDiary,
  updateDiary,
  deleteDiary
} from '../controllers/diaryController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getDiaries);
router.get('/:id', getDiaryById);
router.post('/', authenticateToken, createDiary);
router.put('/:id', authenticateToken, updateDiary);
router.delete('/:id', authenticateToken, deleteDiary);

export default router;
