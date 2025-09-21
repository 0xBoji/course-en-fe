// API exports
export { apiClient, ApiError, handleApiResponse, handleApiError } from './client';
export { API_CONFIG, API_ENDPOINTS } from './config';
export { authApi } from './auth';
export { coursesApi } from './courses';
export { enrollmentsApi } from './enrollments';
export { healthApi } from './health';

// Re-export types for convenience
export type {
  CourseResponse,
  CourseRequest,
  EnrollmentResponse,
  EnrollmentRequest,
  StudentEnrollmentsResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
  AuthState,
  ErrorResponse,
  ApiResponse,
  ApiState,
} from '@/lib/types';
