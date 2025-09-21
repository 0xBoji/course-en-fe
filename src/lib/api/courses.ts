import { apiClient, handleApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from './config';
import type {
  CourseResponse,
  CourseRequest,
  CourseFormData,
  ApiResponse,
  PaginatedCoursesResponse,
  CourseSearchData,
  DifficultyLevel
} from '@/lib/types';

// Course API service functions
export const coursesApi = {
  // Get all courses (legacy - for backward compatibility)
  getAll: async (): Promise<CourseResponse[]> => {
    try {
      const response = await apiClient.get<CourseResponse[]>(API_ENDPOINTS.COURSES);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Search courses with pagination
  search: async (params: CourseSearchData = {}): Promise<PaginatedCoursesResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.query) searchParams.append('search', params.query);
      if (params.difficulty) searchParams.append('difficulty', params.difficulty);

      const url = `${API_ENDPOINTS.COURSES}?${searchParams.toString()}`;
      const response = await apiClient.get<PaginatedCoursesResponse>(url);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get course by ID
  getById: async (id: string): Promise<CourseResponse> => {
    try {
      const response = await apiClient.get<CourseResponse>(`${API_ENDPOINTS.COURSES}/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create new course
  create: async (courseData: CourseFormData): Promise<CourseResponse> => {
    try {
      const jsonData: CourseRequest = {
        title: courseData.title,
        description: courseData.description,
        difficulty: courseData.difficulty,
      };

      const response = await apiClient.post<CourseResponse>(
        API_ENDPOINTS.COURSES,
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Search courses with server-side pagination
  searchWithPagination: async (params: CourseSearchData = {}): Promise<PaginatedCoursesResponse> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.query && params.query.trim()) searchParams.append('search', params.query.trim());
      if (params.difficulty) searchParams.append('difficulty', params.difficulty);

      const url = `${API_ENDPOINTS.COURSES}?${searchParams.toString()}`;
      const response = await apiClient.get<PaginatedCoursesResponse>(url);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get courses by difficulty level
  getByDifficulty: async (difficulty: string): Promise<CourseResponse[]> => {
    try {
      const result = await coursesApi.search({ difficulty: difficulty as DifficultyLevel });
      return result.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update course by ID
  update: async (id: string, courseData: Partial<CourseFormData>): Promise<CourseResponse> => {
    try {
      // For now, only support JSON updates (no image update)
      const jsonData = {
        title: courseData.title,
        description: courseData.description,
        difficulty: courseData.difficulty,
      };

      const response = await apiClient.put<CourseResponse>(
        `${API_ENDPOINTS.COURSES}/${id}`,
        jsonData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete course by ID
  delete: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.COURSES}/${id}`);
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get course statistics
  getStats: async (): Promise<{
    total: number;
    byDifficulty: Record<string, number>;
  }> => {
    try {
      const courses = await coursesApi.getAll();
      const stats = {
        total: courses.length,
        byDifficulty: courses.reduce((acc, course) => {
          acc[course.difficulty] = (acc[course.difficulty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };
      return stats;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
