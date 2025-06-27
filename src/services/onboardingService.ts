import prisma from '../config/prisma';
import { OnboardingInput } from '../types';
import logger from '../utils/logger';

class OnboardingService {
  static async trackScreenVisit(screen: string, userId?: string) {
    logger.info(`Tracking visit for screen: ${screen}`);
    
    const stat = await prisma.onboardingStats.upsert({
      where: { screen },
      update: { totalVisits: { increment: 1 } },
      create: { screen, totalVisits: 1, completions: 0, dropOffs: 0 },
    });

    if (userId) {
      await prisma.userProgress.upsert({
        where: { 
          userId_screen: { userId, screen }
        },
        update: { 
          visitedAt: new Date(),
          isCompleted: false,
          completedAt: null
        },
        create: { 
          userId, 
          screen, 
          visitedAt: new Date(),
          isCompleted: false 
        },
      });
    }
    
    logger.debug(`Screen visit tracked: ${JSON.stringify(stat)}`);
    return stat;
  }

  static async trackScreenCompletion(screen: string, userId?: string) {
    logger.info(`Tracking completion for screen: ${screen}`);
    
    const stat = await prisma.onboardingStats.upsert({
      where: { screen },
      update: { completions: { increment: 1 } },
      create: { screen, totalVisits: 0, completions: 1, dropOffs: 0 },
    });
    
    if (userId) {
      await prisma.userProgress.upsert({
        where: { 
          userId_screen: { userId, screen }
        },
        update: { 
          isCompleted: true,
          completedAt: new Date()
        },
        create: { 
          userId, 
          screen, 
          visitedAt: new Date(),
          isCompleted: true,
          completedAt: new Date()
        },
      });
    }
    
    await this.updateDropOffs(screen);
    
    logger.debug(`Screen completion tracked: ${JSON.stringify(stat)}`);
    return stat;
  }

  static async updateDropOffs(screen: string) {
    const stat = await prisma.onboardingStats.findUnique({
      where: { screen }
    });
    
    if (stat) {
      const dropOffs = stat.totalVisits - stat.completions;
      await prisma.onboardingStats.update({
        where: { screen },
        data: { dropOffs }
      });
      logger.debug(`Updated drop-offs for ${screen}: ${dropOffs}`);
    }
  }

  static async updateOnboardingData(userId: string, data: OnboardingInput) {
    logger.info(`Updating onboarding data for user: ${userId}`);
    const onboardingData = await prisma.onboardingData.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    logger.debug(`Onboarding data updated: ${JSON.stringify(onboardingData)}`);
    return onboardingData;
  }

  static async markOnboardingComplete(userId: string) {
    logger.info(`Marking onboarding as complete for user: ${userId}`);
    const onboardingData = await prisma.onboardingData.upsert({
      where: { userId },
      update: { completed: true },
      create: { userId, completed: true },
    });
    logger.debug(`Onboarding marked complete: ${JSON.stringify(onboardingData)}`);
    return onboardingData;
  }
}

export default OnboardingService; 