'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';

import { env } from '@/shared/libs/env';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
});

export default function PrivyWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          showWalletLoginFirst: false,
          walletChainType: 'solana-only',
          walletList: ['solflare', 'phantom'],
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        loginMethods: ['wallet', 'google', 'email'],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        solana: {
          rpcs: {
            'solana:mainnet': {
              rpc: createSolanaRpc(env.NEXT_PUBLIC_SOLANA_RPC_URL),
              rpcSubscriptions: createSolanaRpcSubscriptions(
                env.NEXT_PUBLIC_SOLANA_RPC_URL.replace('https', 'wss'),
              ),
            },
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
