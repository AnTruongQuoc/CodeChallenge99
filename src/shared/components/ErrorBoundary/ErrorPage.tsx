'use client';

import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import AppLogo from '@/shared/components/Logos/AppLogo';
import { Button } from '@/shared/components/ui/button';

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isShowRetry?: boolean;
  isShowBackButton?: boolean;
  isShowHomeButton?: boolean;
}

export const ErrorPage = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the page. Please try again or return to home page.',
  onRetry,
  isShowRetry = true,
  isShowBackButton = true,
  isShowHomeButton = true,
}: ErrorPageProps) => {
  const router = useRouter();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-6 bg-black px-4 text-white'>
      <div className='flex flex-col items-center gap-4'>
        <AppLogo className='text-4xl font-bold' />
        <div className='text-center'>
          <h1 className='mb-2 text-3xl font-bold text-white'>{title}</h1>
          <p className='text-txDark-400 max-w-md text-lg leading-relaxed'>{message}</p>
        </div>
      </div>

      <div className='mt-4 flex flex-col gap-3 sm:flex-row'>
        {isShowRetry && (
          <Button
            onClick={handleRetry}
            className='bg-primary-500 hover:bg-primary-600 flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-colors'
          >
            <RefreshCw className='size-4' />
            Retry
          </Button>
        )}

        {isShowBackButton && (
          <Button
            onClick={handleGoBack}
            variant='outline'
            className='border-txDark-600 bg-bgDark-800 hover:bg-bgDark-800/50 text-txDark-300 hover:border-txDark-400 flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors hover:text-white'
          >
            <ArrowLeft className='size-4' />
            Back
          </Button>
        )}

        {isShowHomeButton && (
          <Button
            onClick={handleGoHome}
            variant='outline'
            className='border-txDark-600 bg-bgDark-800 hover:bg-bgDark-800/50 text-txDark-300 hover:border-txDark-400 flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors hover:text-white'
          >
            <Home className='size-4' />
            Home
          </Button>
        )}
      </div>
    </div>
  );
};
