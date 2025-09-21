'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { LoginForm } from '@/components/auth';
import { useIsAuthenticated } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/courses');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    router.push('/courses');
  };

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Course Enrollment</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Access your learning dashboard
          </p>
        </div>

        {/* Login form */}
        <LoginForm 
          onSuccess={handleLoginSuccess}
          className="w-full"
        />

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need help? Contact{' '}
            <a 
              href="mailto:support@sonic-labs.com" 
              className="text-primary hover:underline"
            >
              support@sonic-labs.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
