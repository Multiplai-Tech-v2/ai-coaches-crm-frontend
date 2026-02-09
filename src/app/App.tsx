import React, { useEffect } from 'react';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { initErrorHandler } from '@/app/utils/errorHandler';
import { AppRoutes } from './AppRoutes';

export default function App() {
  // Initialize error handler on mount
  useEffect(() => {
    initErrorHandler();
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}