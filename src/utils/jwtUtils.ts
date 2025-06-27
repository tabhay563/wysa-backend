import jwt from 'jsonwebtoken';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

logger.info(`JWT_SECRET: ${JWT_SECRET}`);

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (err) {
    logger.error(`Token verification failed: ${(err as Error).message}`);
    throw new Error('UnauthorizedError');
  }
};