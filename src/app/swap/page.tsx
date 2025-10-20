'use client';

import SwapInterface from '@/shared/components/Swap/SwapInterface';
import { SOL_MINT_ADDRESS, USDC_MINT_ADDRESS } from '@/shared/constants/solana';

import UserHeader from './components/User/UserHeader';

export default function SwapPage() {
  return (
    <div className='bg-background flex h-full w-full flex-col items-center justify-center p-4'>
      <UserHeader />
      <div className='flex w-full flex-1 items-center justify-center'>
        <SwapInterface
          defaultInputSearchToken={SOL_MINT_ADDRESS}
          defaultOutputSearchToken={USDC_MINT_ADDRESS}
        />
      </div>
    </div>
  );
}
