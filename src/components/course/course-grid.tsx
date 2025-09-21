'use client';

import { CourseCard } from './course-card';
import type { CourseResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CourseGridProps {
  courses: CourseResponse[];
  showEnrollButton?: boolean;
  onEnroll?: (courseId: string) => void;
  enrolledCourseIds?: string[];
  className?: string;
  emptyMessage?: string;
}

export function CourseGrid({ 
  courses, 
  showEnrollButton = true,
  onEnroll,
  enrolledCourseIds = [],
  className,
  emptyMessage = "No courses found."
}: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          {emptyMessage}
        </div>
        <p className="text-sm text-muted-foreground">
          Check back later for new courses or try adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      className
    )}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          showEnrollButton={showEnrollButton}
          onEnroll={onEnroll}
          isEnrolled={enrolledCourseIds.includes(course.id)}
        />
      ))}
    </div>
  );
}
