import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from './logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    logger.error(`Validation error: ${err.errors}`);
    return res.status(400).json({ message: 'Validation failed', errors: err.errors });
  } else if (err.name === 'UnauthorizedError') {
    logger.error(`Authentication error: ${err.message}`);
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    logger.error(`Internal server error: ${err.stack}`);
    return res.status(500).json({ message: 'Internal server error' });
  }
};