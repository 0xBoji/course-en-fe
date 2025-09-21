import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api/client';

// Create a query client with optimized configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Cache time: how long data stays in cache when not in use (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus in production only
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Background refetch interval (disabled by default)
      refetchInterval: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Course-related queries
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.courses.lists(), filters] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    search: (params?: Record<string, unknown>) =>
      [...queryKeys.courses.all, 'search', params] as const,
  },
  
  // Enrollment-related queries
  enrollments: {
    all: ['enrollments'] as const,
    byStudent: (email: string) => 
      [...queryKeys.enrollments.all, 'student', email] as const,
    isEnrolled: (studentEmail: string, courseId: string) => 
      [...queryKeys.enrollments.all, 'check', { studentEmail, courseId }] as const,
  },
} as const;
