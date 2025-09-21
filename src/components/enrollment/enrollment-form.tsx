'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { enrollmentSchema, type EnrollmentFormData } from '@/lib/validations';
import type { CourseResponse } from '@/lib/types';

interface EnrollmentFormProps {
  course: CourseResponse;
  onSubmit: (data: EnrollmentFormData) => void;
  isLoading?: boolean;
  defaultEmail?: string;
  showCard?: boolean;
}

export function EnrollmentForm({
  course,
  onSubmit,
  isLoading = false,
  defaultEmail = '',
  showCard = true
}: EnrollmentFormProps) {
  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      student_email: defaultEmail,
      course_id: course.id,
    },
  });

  const handleSubmit = (data: EnrollmentFormData) => {
    // Reset form errors before submission
    form.clearErrors();
    onSubmit(data);
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Student Email */}
        <FormField
          control={form.control}
          name="student_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                We'll use this email to track your enrollment and send updates. Each email can only enroll once per course.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden Course ID */}
        <input type="hidden" {...form.register('course_id')} />

        {/* Course Information Display */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Course Details:</h4>
          <p className="text-sm font-medium">{course.title}</p>
          <p className="text-xs text-muted-foreground">
            Difficulty: {course.difficulty}
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Enrolling...' : 'Enroll Now'}
        </Button>
      </form>
    </Form>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Enroll in Course
        </CardTitle>
        <CardDescription>
          Enter your email address to enroll in "{course.title}".
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  );
}
