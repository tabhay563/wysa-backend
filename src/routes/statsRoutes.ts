import { Router } from 'express';
import StatsController from '../controllers/statsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware as any);

/**
 * @swagger
 * /api/stats/analytics:
 *   get:
 *     summary: Get onboarding analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Complete analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: object
 *                     completedUsers:
 *                       type: array
 *                     droppedOffUsers:
 *                       type: array
 *                     screenAnalytics:
 *                       type: array
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', StatsController.getAnalytics);

export default router; 