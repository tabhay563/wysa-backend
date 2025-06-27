import { Prisma } from '@prisma/client';
import { SleepStruggleDuration, DesiredChange } from '../enums/sleepEnums';

export interface UserPayload {
  id: string;
}

export type SignupInput = {
  nickname: string;
  password: string;
};

export type LoginInput = {
  nickname: string;
  password: string;
};

export type OnboardingInput = {
  sleepStruggleDuration?: SleepStruggleDuration;
  bedTime?: string;
  wakeUpTime?: string;
  sleepHours?: number;
  desiredChanges?: DesiredChange[];
};