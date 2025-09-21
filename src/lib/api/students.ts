import { apiClient, handleApiResponse, handleApiError } from './client';
import type { StudentResponse, CourseStudentsResponse } from '@/lib/types';

const API_ENDPOINTS = {
  COURSE_STUDENTS: (courseId: string) => `/courses/${courseId}/students`,
  REMOVE_STUDENT: (courseId: string, email: string) => `/courses/${courseId}/students/${email}`,
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_ENROLLMENTS: '/admin/enrollments',
} as const;

export const studentsApi = {
  // Get students enrolled in a specific course
  getCourseStudents: async (courseId: string): Promise<CourseStudentsResponse> => {
    try {
      const response = await apiClient.get<CourseStudentsResponse>(
        API_ENDPOINTS.COURSE_STUDENTS(courseId)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Remove a student from a course
  removeStudentFromCourse: async (courseId: string, email: string): Promise<void> => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.REMOVE_STUDENT(courseId, email)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all students (admin only)
  getAllStudents: async (): Promise<StudentResponse[]> => {
    try {
      const response = await apiClient.get<StudentResponse[]>(
        API_ENDPOINTS.ADMIN_STUDENTS
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all enrollments (admin only)
  getAllEnrollments: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(
        API_ENDPOINTS.ADMIN_ENROLLMENTS
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete an enrollment (admin only)
  deleteEnrollment: async (enrollmentId: string): Promise<void> => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN_ENROLLMENTS}/${enrollmentId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
