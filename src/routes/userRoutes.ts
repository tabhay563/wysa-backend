import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/user/details:
 *   get:
 *     summary: Get user details and onboarding progress
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     nickname:
 *                       type: string
 *                     currentScreen:
 *                       type: string
 *                       enum: [screen1, screen2, screen3, screen4, complete, completed]
 *                     isOnboardingComplete:
 *                       type: boolean
 *                     progressPercentage:
 *                       type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/details', authMiddleware as any, AuthController.getUserDetails);

export default router; 