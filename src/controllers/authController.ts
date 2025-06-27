import { Request, Response } from 'express';
import AuthService from '../services/authService';
import { SignupInput, LoginInput } from '../types';
import logger from '../utils/logger';

class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { nickname, password } = req.body as SignupInput;
      
      const result = await AuthService.signup({ nickname, password });
      
      res.status(201).json({
        token: result.token,
        user: result.user,
        message: 'Account created successfully'
      });
    } catch (err) {
      logger.error(`Signup failed: ${(err as Error).message}`);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { nickname, password } = req.body as LoginInput;
      
      const result = await AuthService.login({ nickname, password });
      
      res.json({
        token: result.token,
        user: result.user,
        message: 'Login successful'
      });
    } catch (err) {
      logger.error(`Login failed: ${(err as Error).message}`);
      res.status(401).json({ message: (err as Error).message });
    }
  }

  static async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      
      const user = await AuthService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      const userProgress = await AuthService.getUserProgress(userId, user.nickname);
      
      res.json({
        user: userProgress,
        message: 'User details retrieved successfully'
      });
    } catch (err) {
      logger.error(`Get user details failed: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AuthController;