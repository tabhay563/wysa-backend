import { Router } from 'express';
import StatsController from '../controllers/statsController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware as any);

/**
 * @swagger
 * /api/stats/analytics:
 *   get:
 *     summary: Get onboarding analytics with optional filters
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nickname
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: screen
 *         schema:
 *           type: string
 *           enum: [screen1, screen2, screen3, screen4, complete]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [completed, incomplete]

 *     responses:
 *       200:
 *         description: Complete analytics data (filtered if query params provided)
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
 *                       properties:
 *                         totalUsersRegistered:
 *                           type: number
 *                         totalUsersStartedOnboarding:
 *                           type: number
 *                         totalUsersCompletedOnboarding:
 *                           type: number
 *                         overallCompletionRate:
 *                           type: number
 *                         overallDropOffRate:
 *                           type: number
 *                     completedUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           nickname:
 *                             type: string
 *                           registeredAt:
 *                             type: string
 *                           completedAt:
 *                             type: string
 *                     droppedOffUsers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                           nickname:
 *                             type: string
 *                           droppedOffAtScreen:
 *                             type: string
 *                     screenAnalytics:
 *                       type: array
 *                     funnel:
 *                       type: array
 *                     totalMatches:
 *                       type: number
 *                       description: Total number of users matching the filters (only present when filters are applied)
 *                 filters:
 *                   type: object
 *                   description: Applied filters (only present when filters are used)
 *                 appliedFilters:
 *                   type: object
 *                   description: Detailed applied filters (only present when filters are used)
 *                 timestamp:
 *                   type: string
 *       400:
 *         description: Invalid filter parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/analytics', StatsController.getAnalytics);

export default router; 