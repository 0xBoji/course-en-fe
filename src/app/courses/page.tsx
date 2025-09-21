'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout';
import { CourseGrid } from '@/components/course';
import { CourseSearchForm } from '@/components/course';
import { EnrollmentForm } from '@/components/enrollment';
import { CourseGridSkeleton } from '@/components/ui/loading-skeletons';
import { ApiErrorDisplay, EmptyStateDisplay } from '@/components/ui/error-display';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSearchCourses, useCreateEnrollment } from '@/hooks';
import { useToastNotifications } from '@/hooks';
import type { CourseSearchData, EnrollmentFormData, CourseResponse } from '@/lib/types';

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useState<CourseSearchData>({
    page: 1,
    limit: 9, // Show 9 courses per page
  });
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const { showSuccess, showError } = useToastNotifications();

  // Fetch courses with search parameters
  const {
    data: coursesResponse,
    isLoading,
    error,
    refetch,
  } = useSearchCourses(searchParams);

  const courses = (coursesResponse as any)?.data || [];
  const pagination = (coursesResponse as any)?.pagination;

  // Enrollment mutation
  const enrollmentMutation = useCreateEnrollment();

  const handleSearch = (data: CourseSearchData) => {
    setSearchParams({
      ...data,
      page: 1, // Reset to first page when searching
      limit: 9,
    });
  };

  const handleResetSearch = () => {
    setSearchParams({
      page: 1,
      limit: 9,
    });
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({
      ...prev,
      page,
    }));
  };

  const handleEnrollClick = (courseId: string) => {
    const course = courses.find((c: any) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsEnrollDialogOpen(true);
    }
  };

  const handleEnrollSubmit = async (data: EnrollmentFormData) => {
    try {
      await enrollmentMutation.mutateAsync({
        student_email: data.student_email,
        course_id: selectedCourse?.id || '',
      });
      showSuccess(
        'Enrollment successful!',
        `You have been enrolled in "${selectedCourse?.title}".`
      );
      setIsEnrollDialogOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      showError(error, 'Failed to enroll in course');
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <PageContainer>
        <ApiErrorDisplay
          error={error}
          onRetry={handleRetry}
          title="Failed to load courses"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-muted-foreground">
              Discover and enroll in courses that match your interests.
            </p>
          </div>
          <Button asChild>
            <Link href="/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <CourseSearchForm
          onSearch={handleSearch}
          onReset={handleResetSearch}
          defaultValues={searchParams}
          isLoading={isLoading}
        />

        {/* Results */}
        <div>
          {isLoading ? (
            <CourseGridSkeleton count={6} />
          ) : courses.length === 0 ? (
            <EmptyStateDisplay
              title="No courses found"
              description={
                searchParams.query || searchParams.difficulty
                  ? "No courses match your search criteria. Try adjusting your filters."
                  : "No courses are available at the moment. Check back later or create a new course."
              }
              action={
                <div className="flex gap-2">
                  {(searchParams.query || searchParams.difficulty) && (
                    <Button variant="outline" onClick={handleResetSearch}>
                      Clear Filters
                    </Button>
                  )}
                  <Button asChild>
                    <Link href="/courses/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Link>
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="space-y-6">
              {/* Results Info */}
              <div className="flex items-center justify-between">
                {pagination && (
                  <PaginationInfo pagination={pagination} />
                )}
              </div>

              {/* Course Grid */}
              <CourseGrid
                courses={courses}
                onEnroll={handleEnrollClick}
                showEnrollButton={true}
              />

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Dialog */}
      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll in Course</DialogTitle>
            <DialogDescription>
              Complete the form below to enroll in this course.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <EnrollmentForm
              course={selectedCourse}
              onSubmit={handleEnrollSubmit}
              isLoading={enrollmentMutation.isPending}
              showCard={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
