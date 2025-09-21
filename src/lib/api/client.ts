import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { tokenStorage, isTokenExpired } from '@/lib/auth/token-storage';
import type { ErrorResponse } from '@/lib/types';

// Custom error class for API errors
export class ApiError extends Error {
  public status: number;
  public data: ErrorResponse | null;

  constructor(message: string, status: number, data: ErrorResponse | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor for authentication and logging
  client.interceptors.request.use(
    (config) => {
      // Add authentication token if available and not expired
      const token = tokenStorage.getToken();
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Silent request handling
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and response transformation
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Silent response handling - no console logging
      return response;
    },
    (error: AxiosError) => {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        const errorData = data as ErrorResponse;

        // Silent error handling - no console logging

        // Handle authentication errors
        if (status === 401) {
          // Clear invalid token and user data
          tokenStorage.clear();

          // Redirect to login page if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }

        // Create custom error with structured data
        const apiError = new ApiError(
          errorData?.message || `Request failed with status ${status}`,
          status,
          errorData
        );

        return Promise.reject(apiError);
      } else if (error.request) {
        // Network error or no response
        const networkError = new ApiError(
          'Network error. Please check your connection.',
          0,
          null
        );
        return Promise.reject(networkError);
      } else {
        // Request setup error
        const setupError = new ApiError(
          'Request configuration error.',
          0,
          null
        );
        return Promise.reject(setupError);
      }
    }
  );

  return client;
};

// Export the configured API client
export const apiClient = createApiClient();

// Utility function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Utility function to handle API errors
export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw new ApiError(error.message, 0, null);
  }
  
  throw new ApiError('An unexpected error occurred', 0, null);
};
