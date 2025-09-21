import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { studentQueryKeys } from './use-students';
import type { EnrollmentRequest, EnrollmentResponse } from '@/lib/types';

// Hook to fetch student enrollments
export function useStudentEnrollments(email: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.byStudent(email),
    queryFn: () => enrollmentsApi.getByStudentEmail(email),
    enabled: !!email, // Only run query if email is provided
  });
}

// Hook to check if student is enrolled in a course
export function useIsEnrolled(studentEmail: string, courseId: string) {
  return useQuery({
    queryKey: queryKeys.enrollments.isEnrolled(studentEmail, courseId),
    queryFn: () => enrollmentsApi.isEnrolled(studentEmail, courseId),
    enabled: !!(studentEmail && courseId), // Only run if both parameters are provided
  });
}

// Hook to create a new enrollment
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentData: EnrollmentRequest) => 
      enrollmentsApi.create(enrollmentData),
    onSuccess: (newEnrollment: EnrollmentResponse) => {
      // Invalidate student enrollments to refetch updated list
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.byStudent(newEnrollment.student_email),
      });
      
      // Invalidate enrollment check queries for this student and course
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollments.isEnrolled(
          newEnrollment.student_email,
          newEnrollment.course_id
        ),
      });
      
      // Update the enrollment status in cache
      queryClient.setQueryData(
        queryKeys.enrollments.isEnrolled(
          newEnrollment.student_email,
          newEnrollment.course_id
        ),
        true
      );

      // Invalidate course students query to refresh students list
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.courseStudents(newEnrollment.course_id),
      });
    },
  });
}
