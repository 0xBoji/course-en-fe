'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { courseFormSchema } from '@/lib/validations';
import type { DifficultyLevel, CourseFormData } from '@/lib/types';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<CourseFormData>;
  mode?: 'create' | 'edit';
  showHeader?: boolean; // Control whether to show the card header
}

const difficultyOptions: { value: DifficultyLevel; label: string; description: string }[] = [
  {
    value: 'Beginner',
    label: 'Beginner',
    description: 'No prior knowledge required',
  },
  {
    value: 'Intermediate',
    label: 'Intermediate',
    description: 'Some experience recommended',
  },
  {
    value: 'Advanced',
    label: 'Advanced',
    description: 'Extensive experience required',
  },
];

export function CourseForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  mode = 'create',
  showHeader = true,
}: CourseFormProps) {

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'Beginner' as const,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: CourseFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full mx-auto">
      {showHeader && (
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Course' : 'Edit Course'}
          </CardTitle>
          <CardDescription>
            {mode === 'create'
              ? 'Fill in the details below to create a new course.'
              : 'Update the course information below.'
            }
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={showHeader ? '' : 'pt-6'}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Course Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and descriptive title for your course (max 255 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what students will learn in this course"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the course content and learning objectives.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty Level */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the appropriate difficulty level for your target audience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />



            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading 
                  ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                  : (mode === 'create' ? 'Create Course' : 'Update Course')
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
