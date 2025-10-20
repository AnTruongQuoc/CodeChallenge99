import { useEffect, useMemo, useState } from 'react';

import axios from 'axios';

import { env } from '@/shared/libs/env';
import { cn } from '@/shared/libs/utils';

const pingColorsThresholds = {
  100: { color: 'bg-green-500', bgColor: 'bg-green-400/20', textColor: 'text-green-400' },
  200: { color: 'bg-yellow-500', bgColor: 'bg-yellow-400/20', textColor: 'text-yellow-400' },
  300: { color: 'bg-red-500', bgColor: 'bg-red-400/20', textColor: 'text-red-400' },
} as const satisfies Record<number, { color: string; bgColor: string; textColor: string }>;

type PingColorThresholdKey = keyof typeof pingColorsThresholds;

export default function HeliusPing() {
  const [ping, setPing] = useState<number>(-1);

  useEffect(() => {
    const ping = async () => {
      const start = performance.now();

      try {
        const response = await axios.post(env.NEXT_PUBLIC_SOLANA_RPC_URL, {
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth',
        });
        if (response.status === 200) {
          const end = performance.now();
          setPing(Math.round((end - start) / 2));
        } else {
          setPing(-1);
        }
      } catch (error: unknown) {
        console.error('HeliusPing error:', error);
        setPing(-1);
      }
    };

    ping();

    // Increase to 15 seconds to avoid rate limiting
    const interval = setInterval(ping, 15_000);
    return () => clearInterval(interval);
  }, []);

  const { color, bgColor, textColor } = useMemo(() => {
    for (const threshold of Object.keys(pingColorsThresholds)) {
      if (ping < parseInt(threshold)) {
        const key = threshold as unknown as PingColorThresholdKey;
        return pingColorsThresholds[key];
      }
    }
    // Fallback to red
    return pingColorsThresholds[300];
  }, [ping]);

  return ping === -1 ? (
    <div className='flex flex-row items-center justify-center gap-1.5 rounded-sm bg-red-400/20 px-1.5 py-1'>
      <span className='inline-flex size-2.5 rounded-full bg-red-500 opacity-75'></span>
      <span className='text-foreground text-xs font-normal'>Disconnected</span>
    </div>
  ) : (
    <div
      className={cn(
        'flex flex-row items-center justify-center gap-1.5 rounded-sm px-1.5 py-1',
        bgColor,
      )}
    >
      <span
        className={cn('inline-flex size-2.5 animate-pulse rounded-full opacity-75', color)}
      ></span>
      <span className={cn('text-foreground text-xs font-semibold', textColor)}>{ping}ms</span>
    </div>
  );
}
