'use client';

import { Calendar, Clock, Users, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CourseResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CourseDetailProps {
  course: CourseResponse;
  onEnroll?: (courseId: string) => void;
  isEnrolled?: boolean;
  isLoading?: boolean;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
} as const;

const difficultyDescriptions = {
  Beginner: 'Perfect for those new to the subject',
  Intermediate: 'Requires some prior knowledge',
  Advanced: 'For experienced learners',
} as const;

export function CourseDetail({ 
  course, 
  onEnroll,
  isEnrolled = false,
  isLoading = false
}: CourseDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEnroll = () => {
    if (onEnroll && !isEnrolled) {
      onEnroll(course.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Image */}
      {course.image_url && (
        <Card>
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={course.image_url}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
      )}

      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2 min-w-0 flex-1">
              <CardTitle className="text-2xl md:text-3xl font-bold break-words">
                {course.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'text-sm font-medium',
                    difficultyColors[course.difficulty]
                  )}
                >
                  {course.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {difficultyDescriptions[course.difficulty]}
                </span>
              </div>
            </div>
            
            <Button
              onClick={handleEnroll}
              disabled={isEnrolled || isLoading}
              size="lg"
              className="shrink-0"
              variant={isEnrolled ? "secondary" : "default"}
            >
              {isLoading ? (
                'Processing...'
              ) : isEnrolled ? (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Enrolled
                </>
              ) : (
                'Enroll Now'
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="text-base leading-relaxed break-words whitespace-pre-wrap">
            {course.description}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Course Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(course.created_at)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  Self-paced learning
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What You'll Learn (placeholder for future enhancement) */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Comprehensive understanding of the subject matter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Practical skills and hands-on experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Industry best practices and real-world applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Foundation for advanced topics in this field</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
