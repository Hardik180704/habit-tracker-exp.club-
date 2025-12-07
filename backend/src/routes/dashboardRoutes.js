import express from 'express';
import { getDashboardStats, getRunningStats, getFiveAMClubStats } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authMiddleware, getDashboardStats);
router.get('/stats/running', authMiddleware, getRunningStats);
router.get('/stats/5am-club', authMiddleware, getFiveAMClubStats);

export default router;
