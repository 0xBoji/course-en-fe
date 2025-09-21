'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { courseSearchSchema, type CourseSearchData } from '@/lib/validations';
import type { DifficultyLevel } from '@/lib/types';

interface CourseSearchFormProps {
  onSearch: (data: CourseSearchData) => void;
  onReset: () => void;
  defaultValues?: Partial<CourseSearchData>;
  isLoading?: boolean;
}

const difficultyOptions: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export function CourseSearchForm({ 
  onSearch, 
  onReset,
  defaultValues,
  isLoading = false
}: CourseSearchFormProps) {
  const form = useForm<CourseSearchData>({
    resolver: zodResolver(courseSearchSchema),
    defaultValues: {
      query: '',
      difficulty: undefined,
      ...defaultValues,
    },
  });

  const handleSubmit = (data: CourseSearchData) => {
    onSearch(data);
  };

  const handleReset = () => {
    form.reset({
      query: '',
      difficulty: undefined,
    });
    onReset();
  };

  const hasFilters = form.watch('query') || (form.watch('difficulty') && form.watch('difficulty') !== undefined);

  return (
    <div className="bg-card border rounded-lg p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Search & Filter Courses</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Query */}
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Search</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Difficulty Filter */}
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Difficulty</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value === 'all' ? undefined : value);
                    }}
                    value={field.value || 'all'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {difficultyOptions.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-end gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
              
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
