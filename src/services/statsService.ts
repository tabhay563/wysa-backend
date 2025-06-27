import prisma from '../config/prisma';
import logger from '../utils/logger';

class StatsService {
  static async getUnifiedAnalytics() {
    try {
      const [users, screenStats] = await Promise.all([
        this.getAllUsers(),
        this.getScreenStats()
      ]);

      const completed = users.filter(u => u.onboardingData?.completed);
      const droppedOff = users.filter(u => !u.onboardingData?.completed);

      return {
        success: true,
        data: {
          summary: this.buildSummary(users, completed, screenStats),
          completedUsers: this.formatCompletedUsers(completed),
          droppedOffUsers: this.formatDroppedUsers(droppedOff),
          screenAnalytics: this.buildScreenAnalytics(users, screenStats),
          funnel: this.buildFunnel(screenStats)
        },
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      logger.error('Analytics fetch failed:', err);
      throw new Error('Failed to get analytics');
    }
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        onboardingData: true,
        userProgress: {
          orderBy: { visitedAt: 'asc' }
        }
      }
    });
  }

  static async getScreenStats() {
    return await prisma.onboardingStats.findMany({
      orderBy: { screen: 'asc' }
    });
  }

  static buildSummary(users: any[], completed: any[], screenStats: any[]) {
    const started = screenStats.find((s: any) => s.screen === 'screen1')?.totalVisits || 0;
    
    return {
      totalUsersRegistered: users.length,
      totalUsersStartedOnboarding: started,
      totalUsersCompletedOnboarding: completed.length,
      overallCompletionRate: this.percent(completed.length, started),
      overallDropOffRate: this.percent(started - completed.length, started)
    };
  }

  static formatCompletedUsers(completed: any[]) {
    return completed.map((user: any) => ({
      userId: user.id,
      nickname: user.nickname,
      registeredAt: user.createdAt,
      completedAt: user.onboardingData?.updatedAt,
      onboardingData: {
        sleepStruggleDuration: user.onboardingData?.sleepStruggleDuration,
        bedTime: user.onboardingData?.bedTime,
        wakeUpTime: user.onboardingData?.wakeUpTime,
        sleepHours: user.onboardingData?.sleepHours,
        desiredChanges: user.onboardingData?.desiredChanges
      },
      journey: user.userProgress
    }));
  }

  static formatDroppedUsers(droppedOff: any[]) {
    return droppedOff.map((user: any) => {
      return {
        userId: user.id,
        nickname: user.nickname,
        droppedOffAtScreen: this.findDropOffPoint(user.userProgress),
        partialData: user.onboardingData || {},
        journey: user.userProgress
      };
    });
  }

  static buildScreenAnalytics(users: any[], screenStats: any[]) {
    return screenStats.map((stat: any) => {
      const visited = users.filter((user: any) => 
        user.userProgress.some((p: any) => p.screen === stat.screen)
      );
      
      const completed = users.filter((user: any) => 
        user.userProgress.some((p: any) => p.screen === stat.screen && p.isCompleted)
      );
      
      const droppedOff = users.filter((user: any) => {
        const progress = user.userProgress.find((p: any) => p.screen === stat.screen);
        return progress && !progress.isCompleted;
      });

      return {
        screen: stat.screen,
        usersWhoVisited: visited.map((u: any) => ({ userId: u.id, nickname: u.nickname })),
        usersWhoCompleted: completed.map((u: any) => ({ userId: u.id, nickname: u.nickname })),
        usersWhoDroppedOff: droppedOff.map((u: any) => ({ userId: u.id, nickname: u.nickname }))
      };
    });
  }

  static buildFunnel(screenStats: any[]) {
    const screens = ['screen1', 'screen2', 'screen3', 'screen4', 'complete'];
    
    return screens.map((screen: string) => {
      const stat = screenStats.find((s: any) => s.screen === screen);
      return {
        screen,
        visits: stat?.totalVisits || 0,
        completions: stat?.completions || 0,
        dropOffs: stat?.dropOffs || 0
      };
    });
  }

  static findDropOffPoint(userProgress: any[]) {
    if (!userProgress.length) return 'screen1';
    
    const incomplete = userProgress.find((p: any) => !p.isCompleted);
    if (incomplete) return incomplete.screen;
    
    const lastCompleted = userProgress[userProgress.length - 1];
    const nextScreen = this.getNextScreen(lastCompleted.screen);
    return nextScreen;
  }

  static getNextScreen(currentScreen: string) {
    const flow: { [key: string]: string } = {
      'screen1': 'screen2',
      'screen2': 'screen3', 
      'screen3': 'screen4',
      'screen4': 'complete',
      'complete': 'completed'
    };
    return flow[currentScreen] || 'screen1';
  }

  static percent(value: number, total: number) {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}

export default StatsService;