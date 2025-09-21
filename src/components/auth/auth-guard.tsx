'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback,
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if still loading or already on login page
    if (isLoading || pathname === redirectTo) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      // Store the current path to redirect back after login
      const returnUrl = pathname !== '/' ? pathname : undefined;
      const loginUrl = returnUrl 
        ? `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
        : redirectTo;
      
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, pathname, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return fallback || null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactNode;
    redirectTo?: string;
  }
) {
  const WrappedComponent = (props: P) => {
    return (
      <AuthGuard 
        fallback={options?.fallback}
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
