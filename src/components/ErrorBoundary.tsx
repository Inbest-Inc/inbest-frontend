import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error tracking service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h1 className="text-xl font-bold text-red-800 mb-2">
            Something went wrong
          </h1>
          {process.env.NEXT_PUBLIC_DEBUG === "true" && (
            <>
              <pre className="text-sm text-red-700 whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap break-words">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
