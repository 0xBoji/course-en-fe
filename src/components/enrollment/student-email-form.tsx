'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Search } from 'lucide-react';
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
import { studentEmailSchema, type StudentEmailData } from '@/lib/validations';

interface StudentEmailFormProps {
  onSubmit: (data: StudentEmailData) => void;
  isLoading?: boolean;
  defaultEmail?: string;
  title?: string;
  description?: string;
}

export function StudentEmailForm({ 
  onSubmit, 
  isLoading = false,
  defaultEmail = '',
  title = 'Check Enrollments',
  description = 'Enter your email address to view your course enrollments.'
}: StudentEmailFormProps) {
  const form = useForm<StudentEmailData>({
    resolver: zodResolver(studentEmailSchema),
    defaultValues: {
      email: defaultEmail,
    },
  });

  const handleSubmit = (data: StudentEmailData) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
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
                    Enter the email address used for course enrollments.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Searching...' : 'View Enrollments'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
