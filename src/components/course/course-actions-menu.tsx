'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditCourseModal } from './edit-course-modal';
import type { CourseResponse } from '@/lib/types';

interface CourseActionsMenuProps {
  course: CourseResponse;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onViewStudents?: (courseId: string) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showViewStudents?: boolean;
}

export function CourseActionsMenu({
  course,
  onEdit,
  onDelete,
  onViewStudents,
  isDeleting = false,
  isEditing = false,
  showEdit = true,
  showDelete = true,
  showViewStudents = true,
}: CourseActionsMenuProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
    if (onEdit) {
      onEdit(course.id);
    }
  };

  const handleDelete = (courseId: string) => {
    if (onDelete) {
      onDelete(courseId);
    }
    setIsDeleteDialogOpen(false);
  };

  // Don't render if no actions available
  if (!showEdit && !showDelete && !showViewStudents) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isDeleting || isEditing}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open course actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-48">
          {showViewStudents && (
            <DropdownMenuItem
              onClick={() => onViewStudents?.(course.id)}
              disabled={isEditing || isDeleting}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              View Students
            </DropdownMenuItem>
          )}

          {showViewStudents && (showEdit || showDelete) && <DropdownMenuSeparator />}

          {showEdit && (
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={isEditing || isDeleting}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Course
            </DropdownMenuItem>
          )}

          {showEdit && showDelete && <DropdownMenuSeparator />}

          {showDelete && (
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting || isEditing}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Course
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      {showEdit && (
        <EditCourseModal
          course={course}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            // Optionally trigger a refresh or callback
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(course.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Simple wrapper for just the dropdown trigger
interface CourseActionsButtonProps {
  course: CourseResponse;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  variant?: 'default' | 'ghost';
}

export function CourseActionsButton({
  course,
  onEdit,
  onDelete,
  isDeleting = false,
  isEditing = false,
  showEdit = true,
  showDelete = true,
  variant = 'ghost',
}: CourseActionsButtonProps) {
  return (
    <CourseActionsMenu
      course={course}
      onEdit={onEdit}
      onDelete={onDelete}
      isDeleting={isDeleting}
      isEditing={isEditing}
      showEdit={showEdit}
      showDelete={showDelete}
    />
  );
}
