import express from 'express';
import {
  getPhotos,
  getPhotoById,
  createPhoto,
  updatePhoto,
  deletePhoto
} from '../controllers/photoController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getPhotos);
router.get('/:id', getPhotoById);
router.post('/', authenticateToken, createPhoto);
router.put('/:id', authenticateToken, updatePhoto);
router.delete('/:id', authenticateToken, deletePhoto);

export default router;
