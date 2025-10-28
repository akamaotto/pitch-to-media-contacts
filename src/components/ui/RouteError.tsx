import React from 'react';
import { Button, Card } from './index';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

interface RouteErrorProps {
  error: Error;
  onRetry?: () => void;
  showRetry?: boolean;
  showNavigation?: boolean;
}

export const RouteError: React.FC<RouteErrorProps> = ({
  error,
  onRetry,
  showRetry = true,
  showNavigation = true
}) => {
  const router = useRouter();
  
  // Determine error type and appropriate messaging
  const getErrorInfo = () => {
    const errorMessage = error.message.toLowerCase();
    
    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection and try again.',
        type: 'network' as const
      };
    }
    
    // Authentication errors
    if (errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
      return {
        title: 'Authentication Error',
        description: 'You need to be logged in to access this content. Please sign in and try again.',
        type: 'auth' as const
      };
    }
    
    // Not found errors
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return {
        title: 'Page Not Found',
        description: 'The page you are looking for does not exist or has been moved.',
        type: 'notFound' as const
      };
    }
    
    // Permission errors
    if (errorMessage.includes('permission') || errorMessage.includes('forbidden')) {
      return {
        title: 'Access Denied',
        description: 'You do not have permission to access this content.',
        type: 'permission' as const
      };
    }
    
    // Default error
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred while loading this page. Please try again.',
      type: 'default' as const
    };
  };

  const errorInfo = getErrorInfo();
  
  // Context-specific retry actions
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default retry behavior - invalidate and reload
      router.invalidate();
    }
  };
  
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate({ to: '/contacts' });
    }
  };
  
  const handleGoHome = () => {
    router.navigate({ to: '/contacts' });
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4 animate-fadeIn">
      <Card className="max-w-lg w-full p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">
              {errorInfo.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {errorInfo.description}
            </p>
            
            {/* Show specific error message in development */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 overflow-auto rounded-md bg-muted p-2 text-xs">
                  {error.message}
                  {error.stack && '\n\n' + error.stack}
                </pre>
              </details>
            )}
            
            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {showRetry && (
                <Button
                  onClick={handleRetry}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              
              {showNavigation && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoHome}
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </>
              )}
            </div>
            
            {/* Additional help text based on error type */}
            {errorInfo.type === 'network' && (
              <p className="mt-3 text-xs text-muted-foreground">
                If the problem persists, the server might be temporarily unavailable.
                Please try again in a few minutes.
              </p>
            )}
            
            {errorInfo.type === 'auth' && (
              <p className="mt-3 text-xs text-muted-foreground">
                If you believe this is an error, please contact support for assistance.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
