import { Request, Response } from 'express';
import StatsService from '../services/statsService';
import logger from '../utils/logger';

class StatsController {
  static async getAnalytics(req: Request, res: Response) {
    try {
      const { nickname, userId, screen, status } = req.query;
      
      // Check if any filters are provided
      const hasFilters = nickname || userId || screen || status;
      
      if (hasFilters) {
        logger.info('Fetching filtered analytics', { 
          filters: { nickname, userId, screen, status } 
        });
        
        const analytics = await StatsService.getFilteredAnalytics({
          nickname: nickname as string,
          userId: userId as string,
          screen: screen as string,
          status: status as string
        });
        
        logger.info('Filtered analytics retrieved successfully');
        
        res.json({
          success: true,
          data: analytics,
          filters: { nickname, userId, screen, status },
          timestamp: new Date().toISOString()
        });
      } else {
        logger.info('Fetching unified analytics');
        const analytics = await StatsService.getUnifiedAnalytics();
        logger.info('Unified analytics retrieved successfully');
        
        res.json({
          success: true,
          data: analytics,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      logger.error(`Analytics failed: ${(err as Error).message}`);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch analytics',
        error: (err as Error).message 
      });
    }
  }

  static async getDropOffs(req: Request, res: Response) {
    return this.getAnalytics(req, res);
  }

  static async getFunnelAnalysis(req: Request, res: Response) {
    return this.getAnalytics(req, res);
  }

  static async getScreenDropOffs(req: Request, res: Response) {
    return this.getAnalytics(req, res);
  }
}

export default StatsController;