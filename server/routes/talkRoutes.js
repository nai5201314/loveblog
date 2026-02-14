import express from 'express';
import {
  getTalks,
  createTalk,
  deleteTalk
} from '../controllers/talkController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
router.get('/', getTalks);
router.post('/', createTalk);
router.delete('/:id', authenticateToken, deleteTalk);

export default router;
