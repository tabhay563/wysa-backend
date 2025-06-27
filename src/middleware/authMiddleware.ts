import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';
import logger from '../utils/logger';

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.error('No token provided');
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId };
    logger.info(`User authenticated: ${decoded.userId}`);
    next();
  } catch (err) {
    logger.error(`Token validation failed: ${(err as Error).message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};