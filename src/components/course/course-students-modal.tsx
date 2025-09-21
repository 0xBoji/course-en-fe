'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, Mail, Calendar, Trash2, AlertTriangle, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ApiErrorDisplay, EmptyStateDisplay } from '@/components/ui/error-display';
import { useCourseStudents, useRemoveStudentFromCourse } from '@/hooks';
import { useToastNotifications } from '@/hooks';
import type { CourseResponse, StudentResponse } from '@/lib/types';

interface CourseStudentsModalProps {
  course: CourseResponse;
  isOpen: boolean;
  onClose: () => void;
}

export function CourseStudentsModal({
  course,
  isOpen,
  onClose,
}: CourseStudentsModalProps) {
  const [studentToRemove, setStudentToRemove] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10; // Show 10 students per page

  const { showSuccess, showError } = useToastNotifications();

  // Fetch course students
  const {
    data: studentsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useCourseStudents(course.id, {
    enabled: isOpen, // Only fetch when modal is open
  });

  // Refetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      refetch();
      setSearchQuery(''); // Reset search when modal opens
      setCurrentPage(1); // Reset to first page
    }
  }, [isOpen, refetch]);

  // Client-side filtering and pagination
  const filteredAndPaginatedStudents = useMemo(() => {
    if (!(studentsData as any)?.students) return { students: [], totalPages: 0, totalStudents: 0 };

    // Filter students based on search query
    const filteredStudents = (studentsData as any).students.filter((email: any) =>
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate pagination
    const totalStudents = filteredStudents.length;
    const totalPages = Math.ceil(totalStudents / studentsPerPage);
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    return {
      students: paginatedStudents,
      totalPages,
      totalStudents,
      filteredTotal: filteredStudents.length,
    };
  }, [(studentsData as any)?.students, searchQuery, currentPage, studentsPerPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Remove student mutation
  const removeStudentMutation = useRemoveStudentFromCourse();

  const handleRemoveStudent = async (email: string) => {
    try {
      await removeStudentMutation.mutateAsync({
        courseId: course.id,
        email: email,
      });

      showSuccess(
        'Student Removed! 🗑️',
        `${email} has been removed from "${course.title}".`
      );
      setStudentToRemove(null);
    } catch (error: any) {
      if (error?.status === 404) {
        showError(
          'Student Not Found',
          'This student may have already been removed from the course.'
        );
      } else {
        showError(error, 'Failed to remove student');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Course Students
            </DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <ApiErrorDisplay
              error={error}
              onRetry={refetch}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Course Students
                </DialogTitle>
                <DialogDescription>
                  Manage students enrolled in "{course.title}"
                </DialogDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh students list</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {isLoading ? 'Loading students...' : 'Refreshing...'}
                </span>
              </div>
            ) : !(studentsData as any)?.students?.length ? (
              <EmptyStateDisplay
                icon={Users}
                title="No Students Enrolled"
                description="No students have enrolled in this course yet."
                className="py-8"
              />
            ) : (
              <div className="space-y-4">
                {/* Course Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant="secondary">{course.difficulty}</Badge>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {(studentsData as any).total} student{(studentsData as any).total !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Students Count Info */}
                {searchQuery && (
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredAndPaginatedStudents.filteredTotal} of {(studentsData as any).total} students
                    {filteredAndPaginatedStudents.filteredTotal !== filteredAndPaginatedStudents.students.length &&
                      ` (page ${currentPage} of ${filteredAndPaginatedStudents.totalPages})`
                    }
                  </div>
                )}

                {/* Students List */}
                {filteredAndPaginatedStudents.students.length === 0 ? (
                  <EmptyStateDisplay
                    icon={Search}
                    title="No Students Found"
                    description={searchQuery ? `No students found matching "${searchQuery}"` : "No students to display"}
                    className="py-8"
                  />
                ) : (
                  <>
                    <div className="space-y-3">
                      {filteredAndPaginatedStudents.students.map((email: any, index: number) => {
                        const globalIndex = (currentPage - 1) * studentsPerPage + index + 1;
                        return (
                          <Card key={email} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                                    <Mail className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{email}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Student #{globalIndex}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setStudentToRemove(email)}
                                  disabled={removeStudentMutation.isPending}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {filteredAndPaginatedStudents.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Page {currentPage} of {filteredAndPaginatedStudents.totalPages}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(filteredAndPaginatedStudents.totalPages, prev + 1))}
                            disabled={currentPage === filteredAndPaginatedStudents.totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Student Confirmation Dialog */}
      <AlertDialog open={!!studentToRemove} onOpenChange={() => setStudentToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Remove Student
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{studentToRemove}</strong> from "{course.title}"?
              <br />
              <br />
              This action cannot be undone. The student will need to re-enroll if they want to access the course again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeStudentMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => studentToRemove && handleRemoveStudent(studentToRemove)}
              disabled={removeStudentMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeStudentMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Removing...
                </>
              ) : (
                'Remove Student'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
