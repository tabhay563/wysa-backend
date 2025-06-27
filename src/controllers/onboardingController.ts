import { Request, Response } from 'express';
import OnboardingService from '../services/onboardingService';
import logger from '../utils/logger';

class OnboardingController {
  static async handleScreen1(req: Request, res: Response) {
    try {
      logger.info('Processing screen 1 data');
      const userId = req.user!.id;
      
      // Track screen visit
      await OnboardingService.trackScreenVisit('screen1', userId);
      
      // Save user data
      await OnboardingService.updateOnboardingData(userId, {
        sleepStruggleDuration: req.body.sleepStruggleDuration,
      });
      
      // Track completion (user proceeded to next screen)
      await OnboardingService.trackScreenCompletion('screen1', userId);
      
      logger.info('Screen 1 data saved');
      res.json({ message: 'Data saved', nextScreen: '/api/onboarding/screen2' });
    } catch (err) {
      logger.error(`Screen 1 error: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async handleScreen2(req: Request, res: Response) {
    try {
      logger.info('Processing screen 2 data');
      const userId = req.user!.id;
      
      // Track screen visit
      await OnboardingService.trackScreenVisit('screen2', userId);
      
      // Save user data
      await OnboardingService.updateOnboardingData(userId, {
        bedTime: req.body.bedTime,
      });
      
      // Track completion
      await OnboardingService.trackScreenCompletion('screen2', userId);
      
      logger.info('Screen 2 data saved');
      res.json({ message: 'Data saved', nextScreen: '/api/onboarding/screen3' });
    } catch (err) {
      logger.error(`Screen 2 error: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async handleScreen3(req: Request, res: Response) {
    try {
      logger.info('Processing screen 3 data');
      const userId = req.user!.id;
      
      // Track screen visit
      await OnboardingService.trackScreenVisit('screen3', userId);
      
      // Save user data
      await OnboardingService.updateOnboardingData(userId, {
        wakeUpTime: req.body.wakeUpTime,
        sleepHours: req.body.sleepHours,
      });
      
      // Track completion
      await OnboardingService.trackScreenCompletion('screen3', userId);
      
      logger.info('Screen 3 data saved');
      res.json({ message: 'Data saved', nextScreen: '/api/onboarding/screen4' });
    } catch (err) {
      logger.error(`Screen 3 error: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async handleScreen4(req: Request, res: Response) {
    try {
      logger.info('Processing screen 4 data');
      const userId = req.user!.id;
      
      // Track screen visit
      await OnboardingService.trackScreenVisit('screen4', userId);
      
      // Save user data
      await OnboardingService.updateOnboardingData(userId, {
        desiredChanges: req.body.desiredChanges,
      });
      
      // Track completion
      await OnboardingService.trackScreenCompletion('screen4', userId);
      
      logger.info('Screen 4 data saved');
      res.json({ message: 'Data saved', nextScreen: '/api/onboarding/complete' });
    } catch (err) {
      logger.error(`Screen 4 error: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async completeOnboarding(req: Request, res: Response) {
    try {
      logger.info('Completing onboarding');
      const userId = req.user!.id;
      
      // Track completion visit
      await OnboardingService.trackScreenVisit('complete', userId);
      
      // Mark onboarding as completed - use separate call
      await OnboardingService.markOnboardingComplete(userId);
      
      // Track completion
      await OnboardingService.trackScreenCompletion('complete', userId);
      
      logger.info('Onboarding completed');
      res.json({ message: 'Onboarding completed successfully!' });
    } catch (err) {
      logger.error(`Complete onboarding error: ${(err as Error).message}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default OnboardingController; 