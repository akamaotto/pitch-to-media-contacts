import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RouteError } from './RouteError';
import { useRouter } from '@tanstack/react-router';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showNavigation?: boolean;
  customMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('RouteErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    // Limit retry attempts to prevent infinite loops
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({ hasError: false, error: null });
    } else {
      // After max retries, show a different message
      this.setState({
        error: new Error(
          `Multiple retry attempts failed. ${this.state.error?.message || 'Please refresh the page or contact support if the problem persists.'}`
        )
      });
    }
  };

  handleReset = () => {
    this.retryCount = 0;
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      // Use the enhanced RouteError component
      return (
        <RouteError 
          error={this.state.error} 
          onRetry={this.handleRetry}
          showNavigation={this.props.showNavigation !== false}
        />
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useRouteErrorBoundary = () => {
  const router = useRouter();
  
  const handleError = React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Route error:', error, errorInfo);
    
    // You could integrate with error reporting services here
    // reportError(error, errorInfo);
  }, []);

  const retry = React.useCallback(() => {
    router.invalidate();
  }, [router]);

  return { handleError, retry };
};

export default RouteErrorBoundary;