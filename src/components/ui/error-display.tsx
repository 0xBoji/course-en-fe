import { AlertTriangle, Wifi, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

// Generic error display
export function ErrorDisplay({ 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  action,
  className
}: ErrorDisplayProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {action && (
          <CardContent className="text-center">
            {action}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Network error display
export function NetworkErrorDisplay({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      title="Connection Error"
      description="Unable to connect to the server. Please check your internet connection and try again."
      action={
        <div className="space-y-2">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      }
    />
  );
}

// Not found error display
export function NotFoundDisplay({ 
  title = "Not Found",
  description = "The page or resource you're looking for doesn't exist.",
  showHomeButton = true
}: {
  title?: string;
  description?: string;
  showHomeButton?: boolean;
}) {
  return (
    <ErrorDisplay
      title={title}
      description={description}
      action={
        showHomeButton ? (
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        ) : undefined
      }
    />
  );
}

// API error display
export function ApiErrorDisplay({ 
  error,
  onRetry,
  title = "Failed to load data"
}: { 
  error?: Error | string;
  onRetry?: () => void;
  title?: string;
}) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';
  
  return (
    <ErrorDisplay
      title={title}
      description={errorMessage}
      action={
        onRetry ? (
          <Button onClick={onRetry} variant="outline" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        ) : undefined
      }
    />
  );
}

// Empty state display
export function EmptyStateDisplay({
  title = "No data found",
  description = "There's nothing to show here yet.",
  action,
  icon: Icon = AlertTriangle,
  className
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center min-h-[300px]", className)}>
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
