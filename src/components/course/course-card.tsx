'use client';

import Link from 'next/link';
import { Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteCourseButton } from './delete-course-dialog';
import type { CourseResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CourseResponse;
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  isEnrolled?: boolean;
  showDeleteButton?: boolean;
  onDelete?: (courseId: string) => void;
  isDeleting?: boolean;
  className?: string;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 hover:bg-green-200',
  Intermediate: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  Advanced: 'bg-red-100 text-red-800 hover:bg-red-200',
} as const;

export function CourseCard({
  course,
  showEnrollButton = true,
  onEnroll,
  isEnrolled = false,
  showDeleteButton = false,
  onDelete,
  isDeleting = false,
  className
}: CourseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll && !isEnrolled) {
      onEnroll(course.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(course.id);
    }
  };

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-200 cursor-pointer',
      'hover:border-primary/50',
      className
    )}>
      <Link href={`/courses/${course.id}`} className="block">
        {/* Course Image */}
        {course.image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={course.image_url}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <Badge 
              variant="secondary" 
              className={cn(
                'shrink-0 text-xs font-medium',
                difficultyColors[course.difficulty]
              )}
            >
              {course.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <CardDescription className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {course.description}
          </CardDescription>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatDate(course.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Self-paced</span>
            </div>
          </div>
        </CardContent>

        {(showEnrollButton || showDeleteButton) && (
          <CardFooter className="pt-0">
            <div className="flex gap-2 w-full">
              {showEnrollButton && (
                <Button
                  onClick={handleEnroll}
                  disabled={isEnrolled}
                  className="flex-1"
                  variant={isEnrolled ? "secondary" : "default"}
                >
                  {isEnrolled ? (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Enrolled
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </Button>
              )}

              {showDeleteButton && onDelete && (
                <DeleteCourseButton
                  course={course}
                  onDelete={onDelete}
                  isLoading={isDeleting}
                  variant="icon"
                />
              )}
            </div>
          </CardFooter>
        )}
      </Link>
    </Card>
  );
}
