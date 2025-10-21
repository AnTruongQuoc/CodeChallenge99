import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const skipValidation = Boolean(process.env.SKIP_ENV_VALIDATION);
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const envSchema = createEnv({
  skipValidation,
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  client: {
    NEXT_PUBLIC_JUPITER_URL: z.url().default('https://api-lite.jup.ag'),
    NEXT_PUBLIC_SOLANA_RPC_URL: z.url().default('https://api.mainnet-beta.solana.com'),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().default(''),
    NEXT_PUBLIC_CSP_ALLOWED_APP_DOMAINS: z.string().default(''),
  },
  runtimeEnv: {
    NEXT_PUBLIC_JUPITER_URL: process.env.NEXT_PUBLIC_JUPITER_URL,
    NEXT_PUBLIC_SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_CSP_ALLOWED_APP_DOMAINS: process.env.NEXT_PUBLIC_CSP_ALLOWED_APP_DOMAINS,
    NODE_ENV: process.env.NODE_ENV,
  },
});

export const env = {
  ...envSchema,
  isDev,
  isProd,
};
