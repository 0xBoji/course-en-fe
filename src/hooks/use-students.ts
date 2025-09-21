import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentsApi } from '@/lib/api/students';
import type { CourseStudentsResponse, StudentResponse } from '@/lib/types';

// Query keys for students
export const studentQueryKeys = {
  all: ['students'] as const,
  courseStudents: (courseId: string) => ['students', 'course', courseId] as const,
  adminStudents: () => ['students', 'admin'] as const,
  adminEnrollments: () => ['enrollments', 'admin'] as const,
};

// Hook to get students enrolled in a course
export function useCourseStudents(courseId: string, options?: any) {
  return useQuery({
    queryKey: studentQueryKeys.courseStudents(courseId),
    queryFn: () => studentsApi.getCourseStudents(courseId),
    enabled: !!courseId,
    staleTime: 0, // Always consider data stale to refetch when needed
    ...options,
  });
}

// Hook to remove a student from a course
export function useRemoveStudentFromCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, email }: { courseId: string; email: string }) =>
      studentsApi.removeStudentFromCourse(courseId, email),
    onSuccess: (_, { courseId }) => {
      // Invalidate course students query
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.courseStudents(courseId),
      });
      
      // Also invalidate admin queries if they exist
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.adminStudents(),
      });
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.adminEnrollments(),
      });
    },
    onError: (error) => {
      // Silent error handling
    },
  });
}

// Hook to get all students (admin only)
export function useAllStudents() {
  return useQuery({
    queryKey: studentQueryKeys.adminStudents(),
    queryFn: () => studentsApi.getAllStudents(),
  });
}

// Hook to get all enrollments (admin only)
export function useAllEnrollments() {
  return useQuery({
    queryKey: studentQueryKeys.adminEnrollments(),
    queryFn: () => studentsApi.getAllEnrollments(),
  });
}

// Hook to delete an enrollment (admin only)
export function useDeleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => studentsApi.deleteEnrollment(enrollmentId),
    onSuccess: () => {
      // Invalidate all student-related queries
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.all,
      });
    },
    onError: (error) => {
      // Silent error handling
    },
  });
}
