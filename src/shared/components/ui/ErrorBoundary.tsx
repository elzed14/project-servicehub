import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log sécurisé (sans données sensibles)
    console.error('Erreur capturée:', {
      message: error.message,
      stack: error.stack?.substring(0, 500),
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Nous nous excusons pour ce désagrément. L'équipe technique a été notifiée.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Recharger la page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}