'use client';

import { useEffect } from 'react';

import { ErrorPage } from '@/shared/components/ErrorBoundary/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
    // TODO: Send error to Sentry
  }, [error]);

  return (
    <ErrorPage
      title='Something went wrong!'
      message='We encountered an error while loading the problem 1. Please try again or return to home page.'
      onRetry={reset}
      isShowRetry={true}
      isShowBackButton={true}
      isShowHomeButton={true}
    />
  );
}
