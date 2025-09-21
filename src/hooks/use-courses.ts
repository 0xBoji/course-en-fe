import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import type { CourseRequest, CourseResponse, CourseFormData, CourseSearchData, PaginatedCoursesResponse } from '@/lib/types';

// Hook to fetch all courses (legacy)
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.lists(),
    queryFn: coursesApi.getAll,
  });
}

// Hook to search courses with server-side pagination
export function useSearchCourses(params: CourseSearchData = {}) {
  return useQuery({
    queryKey: queryKeys.courses.search(params as any),
    queryFn: () => coursesApi.search(params),
    placeholderData: (previousData: any) => previousData, // Keep previous data while loading new page
  });
}

// Hook to fetch a single course by ID
export function useCourse(id: string, options?: any) {
  return useQuery({
    queryKey: queryKeys.courses.detail(id),
    queryFn: () => coursesApi.getById(id),
    enabled: !!id, // Only run query if ID is provided
    ...options,
  });
}



// Hook to create a new course
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseData: CourseFormData) => coursesApi.create(courseData),
    onSuccess: (newCourse: CourseResponse) => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.lists() });
      
      // Add the new course to the cache
      queryClient.setQueryData(
        queryKeys.courses.detail(newCourse.id),
        newCourse
      );
    },
  });
}

// Hook to update a course
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseFormData> }) =>
      coursesApi.update(id, data),
    onSuccess: (updatedCourse, { id }) => {
      // Update the specific course query
      queryClient.setQueryData(
        queryKeys.courses.detail(id),
        updatedCourse
      );

      // Invalidate courses list to refresh
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    onError: (error) => {
      // Silent error handling
    },
  });
}

// Hook to delete a course
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => coursesApi.delete(courseId),
    onSuccess: (_, deletedCourseId) => {
      // Immediately remove from specific course query to prevent 404
      queryClient.removeQueries({
        queryKey: queryKeys.courses.detail(deletedCourseId)
      });

      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });

      // Also invalidate search queries
      queryClient.invalidateQueries({
        queryKey: ['courses', 'search']
      });
    },
    onError: (error) => {
      // Silent error handling
    },
  });
}
