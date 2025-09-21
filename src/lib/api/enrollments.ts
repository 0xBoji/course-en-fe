import { apiClient, handleApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { 
  EnrollmentResponse, 
  EnrollmentRequest,
  StudentEnrollmentsResponse 
} from '@/lib/types';

// Enrollment API service functions
export const enrollmentsApi = {
  // Enroll a student in a course
  create: async (enrollmentData: EnrollmentRequest): Promise<EnrollmentResponse> => {
    try {
      const response = await apiClient.post<EnrollmentResponse>(
        API_ENDPOINTS.ENROLLMENTS,
        enrollmentData
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get all enrollments for a student
  getByStudentEmail: async (email: string): Promise<StudentEnrollmentsResponse> => {
    try {
      const response = await apiClient.get<StudentEnrollmentsResponse>(
        API_ENDPOINTS.STUDENT_ENROLLMENTS(email)
      );
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Check if student is enrolled in a specific course
  isEnrolled: async (studentEmail: string, courseId: string): Promise<boolean> => {
    try {
      const enrollments = await enrollmentsApi.getByStudentEmail(studentEmail);
      return enrollments.enrollments.some(enrollment => enrollment.course_id === courseId);
    } catch (error) {
      // If student has no enrollments, return false instead of throwing error
      return false;
    }
  },
};
