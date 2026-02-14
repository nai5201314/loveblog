import express from 'express';
import diaryRoutes from './diaryRoutes.js';
import photoRoutes from './photoRoutes.js';
import musicRoutes from './musicRoutes.js';
import planRoutes from './planRoutes.js';
import talkRoutes from './talkRoutes.js';
import timeRoutes from './timeRoutes.js';
import adminRoutes from './adminRoutes.js';
import indexRoutes from './indexRoutes.js';
import settingRoutes from './settingRoutes.js';
import uploadRoutes from './upload.js';
import getDashboardStats from './statusRouters.js'
const router = express.Router();
router.use('/', indexRoutes);
router.use('/api/diary', diaryRoutes);
router.use('/api/photo', photoRoutes);
router.use('/api/music', musicRoutes);
router.use('/api/plan', planRoutes);
router.use('/api/talk', talkRoutes);
router.use('/api/time', timeRoutes);
router.use('/api/setting', settingRoutes);
router.use('/api/upload', uploadRoutes);
router.use('/api/status',getDashboardStats)
router.use('/api/admin', adminRoutes);

export default router;
