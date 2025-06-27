import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DesiredChange, SleepStruggleDuration } from '../enums/sleepEnums';
import logger from './logger';


const signupSchema = z.object({
  nickname: z.string().min(3).max(20).trim(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  nickname: z.string().min(3).max(20).trim(),
  password: z.string().min(6),
});

const screen1Schema = z.object({
  sleepStruggleDuration: z.nativeEnum(SleepStruggleDuration),
});

const screen2Schema = z.object({
  bedTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

const screen3Schema = z.object({
  wakeUpTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
});

const screen4Schema = z.object({
  sleepHours: z.number().int().min(1).max(12),
});

const completeSchema = z.object({
  desiredChanges: z.array(z.nativeEnum(DesiredChange)).min(1),
});

const validate = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      logger.warn(`Validation failed: ${result.error.errors}`);
      res.status(400).json({ message: 'Validation failed', errors: result.error.errors });
      return;
    }
    req.body = result.data;
    next();
  };
};

export const validateSignup = validate(signupSchema);
export const validateLogin = validate(loginSchema);
export const validateScreen1 = validate(screen1Schema);
export const validateScreen2 = validate(screen2Schema);
export const validateScreen3 = validate(screen3Schema);
export const validateScreen4 = validate(screen4Schema);
export const validateComplete = validate(completeSchema);