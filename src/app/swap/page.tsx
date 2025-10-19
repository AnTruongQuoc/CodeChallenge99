'use client';

import { usePrivy } from '@privy-io/react-auth';

import SwapInterface from '@/shared/components/Swap/SwapInterface';

import UserHeader from './components/User/UserHeader';

export default function SwapPage() {
  const { authenticated, login } = usePrivy();

  if (!authenticated) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center p-4'>
        <div className='bg-card border-border mx-auto max-w-md rounded-2xl border p-8 text-center shadow-lg'>
          <h1 className='text-foreground mb-4 text-2xl font-bold'>Connect Your Wallet</h1>
          <p className='text-muted-foreground mb-6'>
            Connect your Solana wallet to start swapping tokens with Jupiter
          </p>
          <button
            onClick={() => login()}
            className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700'
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background flex h-full w-full flex-col items-center justify-center p-4'>
      <UserHeader />
      <div className='flex w-full flex-1 items-center justify-center'>
        <SwapInterface />
      </div>
    </div>
  );
}
