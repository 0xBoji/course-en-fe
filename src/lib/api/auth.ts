import { apiClient, handleApiResponse, handleApiError } from './client';
import type { 
  LoginRequest, 
  LoginResponse, 
  UserResponse 
} from '@/lib/types';

// Authentication API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  PROFILE: '/auth/profile',
} as const;

// Authentication API service functions
export const authApi = {
  // User login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get current user profile
  getProfile: async (): Promise<UserResponse> => {
    try {
      const response = await apiClient.get<UserResponse>(AUTH_ENDPOINTS.PROFILE);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
