'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CourseForm } from './course-form';
import { useUpdateCourse } from '@/hooks';
import { useToastNotifications } from '@/hooks';
import type { CourseResponse, CourseFormData } from '@/lib/types';

interface EditCourseModalProps {
  course: CourseResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCourseModal({
  course,
  isOpen,
  onClose,
  onSuccess,
}: EditCourseModalProps) {
  const { showSuccess, showError } = useToastNotifications();

  // Create custom mutation với onSuccess callback
  const updateMutation = useUpdateCourse();

  const handleSubmit = (data: CourseFormData) => {
    updateMutation.mutate({
      id: course.id,
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
      },
    }, {
      onSuccess: () => {
        // Reset mutation state first to clear isPending
        updateMutation.reset();

        // Close modal immediately
        onClose();

        // Show success message
        showSuccess(
          'Course updated successfully!',
          `"${data.title}" has been updated.`
        );

        // Call onSuccess callback
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error) => {
        showError(error, 'Failed to update course');
      }
    });
  };

  const handleClose = () => {
    if (!updateMutation.isPending) {
      onClose();
    }
  };

  // Reset any local state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset any form-related state here if needed
      updateMutation.reset();
    }
  }, [isOpen, updateMutation]);

  // Convert CourseResponse to CourseFormData for default values
  const defaultValues: Partial<CourseFormData> = {
    title: course.title,
    description: course.description,
    difficulty: course.difficulty,
    // Don't include image in edit form for now
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course information below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <CourseForm
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
            defaultValues={defaultValues}
            mode="edit"
            showHeader={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
