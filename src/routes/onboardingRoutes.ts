import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  validateScreen1,
  validateScreen2,
  validateScreen3,
  validateScreen4,
  validateComplete,
} from '../utils/validationMiddleware';
import OnboardingController from '../controllers/onboardingController';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.use(authMiddleware as any);

/**
 * @swagger
 * /api/onboarding/screen1:
 *   post:
 *     summary: Sleep struggle duration
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sleepStruggleDuration
 *             properties:
 *               sleepStruggleDuration:
 *                 type: string
 *                 enum: [LESS_THAN_2_WEEKS, TWO_TO_EIGHT_WEEKS, MORE_THAN_8_WEEKS]
 *     responses:
 *       200:
 *         description: Data saved successfully
 */
router.post('/screen1', validateScreen1, OnboardingController.handleScreen1);

/**
 * @swagger
 * /api/onboarding/screen2:
 *   post:
 *     summary: Bedtime
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bedTime
 *             properties:
 *               bedTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "22:30"
 *     responses:
 *       200:
 *         description: Data saved successfully
 */
router.post('/screen2', validateScreen2, OnboardingController.handleScreen2);

/**
 * @swagger
 * /api/onboarding/screen3:
 *   post:
 *     summary: Wake up time
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - wakeUpTime
 *             properties:
 *               wakeUpTime:
 *                 type: string
 *                 pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
 *                 example: "07:00"
 *     responses:
 *       200:
 *         description: Data saved successfully
 */
router.post('/screen3', validateScreen3, OnboardingController.handleScreen3);

/**
 * @swagger
 * /api/onboarding/screen4:
 *   post:
 *     summary: Sleep hours
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sleepHours
 *             properties:
 *               sleepHours:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *     responses:
 *       200:
 *         description: Data saved successfully
 */
router.post('/screen4', validateScreen4, OnboardingController.handleScreen4);

/**
 * @swagger
 * /api/onboarding/complete:
 *   post:
 *     summary: Complete onboarding
 *     tags: [Onboarding]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - desiredChanges
 *             properties:
 *               desiredChanges:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [GO_TO_SLEEP_EASILY, SLEEP_THROUGH_NIGHT, WAKE_UP_REFRESHED]
 *                 minItems: 1
 *     responses:
 *       200:
 *         description: Onboarding completed successfully
 */
router.post('/complete', validateComplete, OnboardingController.completeOnboarding);

export default router; 