import { Router } from 'express';
import AuthController from '../controllers/authController';
import { validateSignup, validateLogin } from '../utils/validationMiddleware';

const router = Router();



/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - password
 *             properties:
 *               nickname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Nickname already taken
 */
router.post('/signup', validateSignup, AuthController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - password
 *             properties:
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, AuthController.login);



export default router; 