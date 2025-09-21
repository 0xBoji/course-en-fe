'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout';
import { CourseDetail } from '@/components/course';
import { CourseActionsMenu } from '@/components/course/course-actions-menu';
import { EditCourseModal } from '@/components/course/edit-course-modal';
import { CourseStudentsModal } from '@/components/course/course-students-modal';
import { EnrollmentForm } from '@/components/enrollment';
import { CourseDetailSkeleton } from '@/components/ui/loading-skeletons';
import { ApiErrorDisplay, NotFoundDisplay } from '@/components/ui/error-display';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCourse, useCreateEnrollment, useDeleteCourse, useUpdateCourse } from '@/hooks';
import { useToastNotifications } from '@/hooks';
import type { EnrollmentFormData } from '@/lib/validations';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const { showSuccess, showError } = useToastNotifications();

  // Fetch course details
  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useCourse(courseId, {
    retry: (failureCount: number, error: any) => {
      // Don't retry on 404 errors (course not found/deleted)
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Enrollment mutation
  const enrollmentMutation = useCreateEnrollment();

  // Delete mutation
  const deleteMutation = useDeleteCourse();

  // Update mutation
  const updateMutation = useUpdateCourse();

  const handleEnrollClick = () => {
    setIsEnrollDialogOpen(true);
  };

  const handleEnrollSubmit = async (data: EnrollmentFormData) => {
    try {
      await enrollmentMutation.mutateAsync(data);
      showSuccess(
        'Enrollment Successful! 🎉',
        `You have been enrolled in "${(course as any)?.title}". Welcome aboard!`
      );
      setIsEnrollDialogOpen(false);
    } catch (error: any) {
      // Handle specific error cases
      if (error?.status === 409) {
        showError(
          'Already Enrolled! ⚠️',
          `This email is already enrolled in "${(course as any)?.title}". Each email can only enroll once per course.`
        );
      } else if (error?.status === 400) {
        showError(
          'Invalid Data ❌',
          'Please check your email address and try again.'
        );
      } else if (error?.status === 404) {
        showError(
          'Course Not Found 🔍',
          'This course may have been deleted or is no longer available.'
        );
      } else {
        showError(error, 'Failed to enroll in course');
      }
    }
  };

  const handleEditCourse = (courseId: string) => {
    // Edit will be handled by the modal
    setIsEditModalOpen(true);
  };

  const handleViewStudents = (courseId: string) => {
    setIsStudentsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteMutation.mutateAsync(courseId);
      showSuccess(
        'Course deleted successfully!',
        'The course has been permanently removed.'
      );
      // Immediate redirect to prevent 404 errors
      router.replace('/courses');
    } catch (error) {
      showError(error, 'Failed to delete course');
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <CourseDetailSkeleton />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    // Check if it's a 404 error
    const isNotFound = error.message?.includes('404') || error.message?.includes('not found');
    
    if (isNotFound) {
      return (
        <PageContainer>
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <NotFoundDisplay
            title="Course not found"
            description="The course you're looking for doesn't exist or has been removed."
            showHomeButton={false}
          />
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ApiErrorDisplay
          error={error}
          onRetry={handleRetry}
          title="Failed to load course"
        />
      </PageContainer>
    );
  }

  if (!course) {
    return (
      <PageContainer>
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <NotFoundDisplay
          title="Course not found"
          description="The course you're looking for doesn't exist."
          showHomeButton={false}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header with Back Button and Actions Menu */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>

          <CourseActionsMenu
            course={course as any}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onViewStudents={handleViewStudents}
            isDeleting={deleteMutation.isPending}
            isEditing={updateMutation.isPending}
          />
        </div>

        {/* Course Detail */}
        <CourseDetail
          course={course as any}
          onEnroll={handleEnrollClick}
          isLoading={enrollmentMutation.isPending}
        />
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
          <EnrollmentForm
            course={course as any}
            onSubmit={handleEnrollSubmit}
            isLoading={enrollmentMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      {course && (
        <EditCourseModal
          course={course as any}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            // Refresh course data after successful edit
            setTimeout(() => {
              refetch();
            }, 100);
          }}
        />
      )}

      {/* Course Students Modal */}
      {course && (
        <CourseStudentsModal
          course={course as any}
          isOpen={isStudentsModalOpen}
          onClose={() => setIsStudentsModalOpen(false)}
        />
      )}
    </PageContainer>
  );
}
