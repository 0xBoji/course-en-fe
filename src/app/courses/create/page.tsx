'use client';

import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { CourseForm } from '@/components/course';
import { useCreateCourse } from '@/hooks';
import { useToastNotifications } from '@/hooks';
import type { CourseFormData } from '@/lib/types';

export default function CreateCoursePage() {
  const router = useRouter();
  const { showSuccess, showError } = useToastNotifications();
  
  // Course creation mutation
  const createCourseMutation = useCreateCourse();

  const handleSubmit = async (data: CourseFormData) => {
    try {
      const newCourse = await createCourseMutation.mutateAsync(data);
      showSuccess(
        'Course created successfully!',
        `"${newCourse.title}" has been created.`
      );
      router.push(`/courses/${newCourse.id}`);
    } catch (error) {
      showError(error, 'Failed to create course');
    }
  };

  const handleCancel = () => {
    router.push('/courses');
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground">
            Fill in the details below to create a new course for students to enroll in.
          </p>
        </div>

        {/* Course Form */}
        <div className="w-full max-w-4xl mx-auto">
          <CourseForm
            onSubmit={handleSubmit}
            isLoading={createCourseMutation.isPending}
            mode="create"
          />

          {/* Cancel Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel and return to courses
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
