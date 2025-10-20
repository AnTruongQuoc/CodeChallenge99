'use client';

import { ArrowUpDown, Loader2 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function SwapButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  className = '',
}: SwapButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 text-lg font-semibold transition-all duration-200 ${
        disabled || loading
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl'
      } ${className}`}
    >
      {loading ? (
        <div className='flex items-center gap-2'>
          <Loader2 className='h-5 w-5 animate-spin' />
          Processing...
        </div>
      ) : (
        children
      )}
    </Button>
  );
}

export function SwapDirectionButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='group bg-card border-border hover:bg-accent absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 p-2 transition-colors hover:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-75'
    >
      <ArrowUpDown className='text-foreground size-4 transition-colors group-hover:text-indigo-500' />
    </button>
  );
}
