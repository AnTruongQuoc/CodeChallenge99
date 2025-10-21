import { useState } from 'react';

import { usePrivy } from '@privy-io/react-auth';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import HeliusPing from '@/app/swap/components/Ping/HeliusPing';
import { Button } from '@/shared/components/ui/button';
import { truncateAddress } from '@/shared/utils/string';

export default function UserHeader() {
  const { authenticated, user, logout } = usePrivy();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      toast.error('Failed to copy text: ' + err);
    }
  };

  return (
    <div className='flex w-full flex-row items-center justify-end gap-4'>
      {authenticated ? (
        <>
          <div className='bg-card flex h-6 flex-row items-center rounded-sm'>
            <span className='text-foreground rounded-sm px-2 text-sm font-medium'>
              Hi, {authenticated ? truncateAddress(user?.wallet?.address || '') : 'Guest'}
            </span>
            <Button
              onClick={() => copyToClipboard(user?.wallet?.address || '')}
              className='flex h-6 cursor-pointer items-center transition-colors'
              variant='ghost'
              size='icon'
              title='Copy Address'
            >
              {copiedAddress ? (
                <Check className='size-3 text-green-400' />
              ) : (
                <Copy className='size-3' />
              )}
            </Button>
          </div>
          <Button
            onClick={logout}
            className='h-6 cursor-pointer rounded-sm bg-red-500 px-2 text-white hover:bg-red-600'
          >
            Logout
          </Button>
        </>
      ) : (
        <span className='text-foreground rounded-sm px-2 text-sm font-medium'>Hi, Guest</span>
      )}
      <HeliusPing />
    </div>
  );
}
