'use client';

import PrivyWalletProvider from '@/shared/providers/PrivyProvider';

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return <PrivyWalletProvider>{children}</PrivyWalletProvider>;
}
