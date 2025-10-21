'use client';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { Info, TrendingDown } from 'lucide-react';

import { OrderResponse, SearchItem } from '@/shared/api/jupiter/types';
import { cn } from '@/shared/libs/utils';

interface SwapInfoProps {
  quote: OrderResponse['data'] | null;
  isLoading?: boolean;
  className?: string;
  outputToken: SearchItem | null;
}

export default function SwapInfo({
  quote,
  isLoading = false,
  className = '',
  outputToken,
}: SwapInfoProps) {
  if (!quote) {
    return null;
  }

  const priceImpact = Math.abs(Number(quote.priceImpact));
  const priceImpactColor =
    priceImpact > 5 ? 'text-red-400' : priceImpact > 1 ? 'text-yellow-400' : 'text-green-400';

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
      <div className={cn('space-y-3', className)}>
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <Info className='h-4 w-4' />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className='flex items-center gap-2 text-sm text-indigo-400'>
        <Info className='h-4 w-4' />
        <span className='font-semibold'>Swap Details</span>
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
            <span className='font-mono'>{Number(priceImpact).toFixed(3)}%</span>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground'>Minimum Received</span>
          <span className='text-foreground font-mono'>
            {formatNumber(
              BigNumber(quote.otherAmountThreshold)
                .div(10 ** (outputToken?.decimals || 0))
                .toNumber(),
            )}
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
            ~{BigNumber(quote.signatureFeeLamports).div(LAMPORTS_PER_SOL).dp(9).toString()} SOL
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

      {Number(priceImpact) > 5 && (
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
