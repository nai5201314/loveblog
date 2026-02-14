import express from 'express';
import {
  getMusics,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic
} from '../controllers/musicController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getMusics);
router.get('/:id', getMusicById);
router.post('/', authenticateToken, createMusic);
router.put('/:id', authenticateToken, updateMusic);
router.delete('/:id', authenticateToken, deleteMusic);

export default router;
