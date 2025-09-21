import { env } from '@/lib/env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: env.NEXT_PUBLIC_API_URL,
  API_VERSION: env.NEXT_PUBLIC_API_VERSION,
  TIMEOUT: 10000,
} as const;

export const API_ENDPOINTS = {
  COURSES: '/courses',
  ENROLLMENTS: '/enrollments',
  STUDENT_ENROLLMENTS: (email: string) => `/students/${email}/enrollments`,
} as const;
