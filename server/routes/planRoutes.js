import express from 'express';
import {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan
} from '../controllers/planController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getPlans);
router.get('/:id', getPlanById);
router.post('/', authenticateToken, createPlan);
router.put('/:id', authenticateToken, updatePlan);
router.delete('/:id', authenticateToken, deletePlan);

export default router;
