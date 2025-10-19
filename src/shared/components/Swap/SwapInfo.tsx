'use client';

import { Info, TrendingDown, TrendingUp } from 'lucide-react';

import { OrderResponse } from '@/shared/api/jupiter/types';

interface SwapInfoProps {
  quote: OrderResponse['data'] | null;
  isLoading?: boolean;
  className?: string;
}

export default function SwapInfo({ quote, isLoading = false, className = '' }: SwapInfoProps) {
  if (!quote) {
    return null;
  }

  const priceImpact = parseFloat(quote.priceImpactPct);
  const priceImpactColor =
    priceImpact > 5 ? 'text-red-400' : priceImpact > 1 ? 'text-yellow-400' : 'text-green-400';
  const priceImpactIcon =
    priceImpact > 1 ? <TrendingDown className='h-4 w-4' /> : <TrendingUp className='h-4 w-4' />;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(4);
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Info className='h-4 w-4' />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <Info className='h-4 w-4' />
        <span>Swap Details</span>
      </div>

      <div className='space-y-2 text-sm'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Rate</span>
          <span className='text-foreground font-mono'>
            1 ≈ {(quote.inUsdValue / quote.outUsdValue).toFixed(6)}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Price Impact</span>
          <div className={`flex items-center gap-1 ${priceImpactColor}`}>
            {priceImpactIcon}
            <span className='font-mono'>{Math.abs(priceImpact).toFixed(2)}%</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Minimum Received</span>
          <span className='text-foreground font-mono'>
            {formatNumber(parseFloat(quote.otherAmountThreshold))}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Platform Fee</span>
          <span className='text-foreground font-mono'>
            {quote.platformFee ? `${quote.platformFee.feeBps / 100}%` : '0%'}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Network Fee</span>
          <span className='text-foreground font-mono'>
            ~{(quote.signatureFeeLamports / 1e9).toFixed(4)} SOL
          </span>
        </div>

        {quote.routePlan && quote.routePlan.length > 1 && (
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Route</span>
            <span className='text-foreground'>
              {quote.routePlan.length} step{quote.routePlan.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {priceImpact > 5 && (
        <div className='rounded-lg border border-red-400/20 bg-red-400/10 p-3'>
          <div className='flex items-center gap-2 text-red-400'>
            <TrendingDown className='h-4 w-4' />
            <span className='text-sm font-medium'>High Price Impact</span>
          </div>
          <p className='mt-1 text-xs text-red-300'>
            This swap has a high price impact. Consider splitting into smaller trades.
          </p>
        </div>
      )}
    </div>
  );
}
