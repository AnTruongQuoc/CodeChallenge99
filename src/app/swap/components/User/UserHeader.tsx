import { usePrivy } from '@privy-io/react-auth';

import HeliusPing from '@/app/swap/components/Ping/HeliusPing';
import { Button } from '@/shared/components/ui/button';
import { truncateAddress } from '@/shared/utils/string';

export default function UserHeader() {
  const { authenticated, user, logout } = usePrivy();

  return (
    <div className='flex w-full flex-row items-center justify-end gap-4'>
      <h1 className='text-foreground text-sm font-medium'>
        Hi, {authenticated ? truncateAddress(user?.wallet?.address || '') : 'Guest'}
      </h1>
      {authenticated && (
        <Button
          onClick={logout}
          className='h-6 cursor-pointer rounded-sm bg-red-500 px-2 text-white hover:bg-red-600'
        >
          Disconnect
        </Button>
      )}
      <HeliusPing />
    </div>
  );
}
