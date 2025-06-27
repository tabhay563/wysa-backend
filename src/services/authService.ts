import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils';
import { SignupInput, LoginInput } from '../types';
import logger from '../utils/logger';

interface UserProgress {
  userId: string;
  nickname: string;
  currentScreen: string;
  isOnboardingComplete: boolean;
  progressPercentage: number;
}

class AuthService {
  static async signup({ nickname, password }: SignupInput): Promise<{ token: string; user: UserProgress }> {
    logger.info(`Signup attempt for nickname: ${nickname}`);
    const existingUser = await prisma.user.findUnique({ where: { nickname } });
    if (existingUser) {
      logger.warn(`Nickname already taken: ${nickname}`);
      throw new Error('Nickname already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nickname, password: hashedPassword },
    });
    
    logger.info(`User created: ${user.id}`);
    
    // Get user progress (will be empty for new user)
    const userProgress = await this.getUserProgress(user.id, nickname);
    
    return {
      token: generateToken(user.id),
      user: userProgress
    };
  }

  static async login({ nickname, password }: LoginInput): Promise<{ token: string; user: UserProgress }> {
    logger.info(`Login attempt for nickname: ${nickname}`);
    const user = await prisma.user.findUnique({ where: { nickname } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      logger.warn(`Invalid credentials for nickname: ${nickname}`);
      throw new Error('Invalid credentials');
    }
    
    logger.info(`User logged in: ${user.id}`);
    
    // Get user progress
    const userProgress = await this.getUserProgress(user.id, nickname);
    
    return {
      token: generateToken(user.id),
      user: userProgress
    };
  }

  static async getUserById(userId: string): Promise<{ id: string; nickname: string } | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, nickname: true }
      });
      return user;
    } catch (error) {
      logger.error(`Failed to get user by ID: ${userId}`, error);
      return null;
    }
  }

  static async getUserProgress(userId: string, nickname: string): Promise<UserProgress> {
    const onboardingData = await prisma.onboardingData.findUnique({
      where: { userId },
    });

    const userProgressRecords = await prisma.userProgress.findMany({
      where: { userId, isCompleted: true },
      orderBy: { completedAt: 'desc' },
    });

    const currentScreen = this.determineCurrentScreen(onboardingData, userProgressRecords);
    const progressPercentage = this.calculateProgressPercentage(userProgressRecords, onboardingData?.completed || false);

    return {
      userId,
      nickname,
      currentScreen,
      isOnboardingComplete: onboardingData?.completed || false,
      progressPercentage,
    };
  }

  private static determineCurrentScreen(
    onboardingData: any,
    userProgressRecords: any[]
  ): string {
    if (onboardingData?.completed) {
      return 'completed';
    }

    if (!onboardingData && userProgressRecords.length === 0) {
      return 'screen1';
    }

    const completedScreens = userProgressRecords.map(record => record.screen);
    
    if (!completedScreens.includes('screen1')) {
      return 'screen1';
    }
    if (!completedScreens.includes('screen2')) {
      return 'screen2';
    }
    if (!completedScreens.includes('screen3')) {
      return 'screen3';
    }
    if (!completedScreens.includes('screen4')) {
      return 'screen4';
    }
    if (!completedScreens.includes('complete')) {
      return 'complete';
    }

    return 'completed';
  }

  private static calculateProgressPercentage(
    userProgressRecords: any[],
    isComplete: boolean
  ): number {
    if (isComplete) {
      return 100;
    }

    const totalScreens = 5;
    const completedScreens = userProgressRecords.length;
    
    return Math.round((completedScreens / totalScreens) * 100);
  }
}

export default AuthService;