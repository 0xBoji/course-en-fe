import { apiClient, handleApiResponse, handleApiError } from './client';

// Health check API service
export const healthApi = {
  // Check if the API is healthy
  check: async (): Promise<{ status: string; timestamp: string }> => {
    try {
      const response = await apiClient.get('/health');
      return handleApiResponse(response);
    } catch (error) {
      // If health endpoint doesn't exist, try a simple request to courses
      try {
        await apiClient.get('/courses');
        return {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        };
      } catch (fallbackError) {
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
        };
      }
    }
  },

  // Test API connectivity
  ping: async (): Promise<boolean> => {
    try {
      await healthApi.check();
      return true;
    } catch {
      return false;
    }
  },
};
