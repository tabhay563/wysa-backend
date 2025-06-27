import jwt from 'jsonwebtoken';
import logger from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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