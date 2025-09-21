'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { CourseResponse } from '@/lib/types';

interface DeleteCourseDialogProps {
  course: CourseResponse;
  onDelete: (courseId: string) => void;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

export function DeleteCourseDialog({
  course,
  onDelete,
  isLoading = false,
  trigger,
}: DeleteCourseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete(course.id);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button
      variant="destructive"
      size="sm"
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Delete Course
    </Button>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle>Delete Course</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Are you sure you want to delete this course? This action cannot be undone.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="my-4 rounded-lg border bg-muted/50 p-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-1">Course to be deleted:</h4>
          <p className="font-semibold">{course.title}</p>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {course.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium">
              {course.difficulty}
            </span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Course
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Simple delete button component
interface DeleteCourseButtonProps {
  course: CourseResponse;
  onDelete: (courseId: string) => void;
  isLoading?: boolean;
  variant?: 'default' | 'icon' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
}

export function DeleteCourseButton({
  course,
  onDelete,
  isLoading = false,
  variant = 'default',
  size = 'sm',
}: DeleteCourseButtonProps) {
  if (variant === 'icon') {
    return (
      <DeleteCourseDialog
        course={course}
        onDelete={onDelete}
        isLoading={isLoading}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete course</span>
          </Button>
        }
      />
    );
  }

  return (
    <DeleteCourseDialog
      course={course}
      onDelete={onDelete}
      isLoading={isLoading}
      trigger={
        <Button
          variant={variant === 'ghost' ? 'ghost' : 'destructive'}
          size={size}
          className={variant === 'ghost' ? 'text-destructive hover:bg-destructive/10 hover:text-destructive' : ''}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      }
    />
  );
}
