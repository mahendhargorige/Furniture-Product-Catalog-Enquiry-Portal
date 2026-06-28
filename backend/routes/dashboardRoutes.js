import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/dashboard/summary (Protected)
router.get('/summary', authenticateToken, getDashboardSummary);

export default router;
