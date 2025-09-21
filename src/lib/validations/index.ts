import { z } from 'zod';
import type { DifficultyLevel } from '@/lib/types';

// Difficulty level validation
export const difficultySchema = z.enum(['Beginner', 'Intermediate', 'Advanced'] as const);

// Course validation schema matching backend models.CourseRequest
export const courseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
  difficulty: difficultySchema,
});

// Course form validation schema
export const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .trim(),
  difficulty: difficultySchema,
});

// Enrollment validation schema matching backend models.EnrollmentRequest
export const enrollmentSchema = z.object({
  student_email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  course_id: z
    .string()
    .min(1, 'Course ID is required')
    .uuid('Invalid course ID format'),
});

// Search and filter schemas for UI
export const courseSearchSchema = z.object({
  query: z.string().optional(),
  difficulty: difficultySchema.optional(),
});

export const studentEmailSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
});

// Type exports for form data
export type CourseValidationData = z.infer<typeof courseSchema>;
export type CourseFormValidationData = z.infer<typeof courseFormSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
export type CourseSearchData = z.infer<typeof courseSearchSchema>;
export type StudentEmailData = z.infer<typeof studentEmailSchema>;
