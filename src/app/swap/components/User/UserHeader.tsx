import { usePrivy } from '@privy-io/react-auth';

import { Button } from '@/shared/components/ui/button';
import { truncateAddress } from '@/shared/utils/string';

export default function UserHeader() {
  const { user, logout } = usePrivy();
  return (
    <div className='flex w-full flex-row items-center justify-end gap-4'>
      <h1 className='text-foreground text-sm font-medium'>
        Welcome, {truncateAddress(user?.wallet?.address || '')}
      </h1>
      <Button onClick={logout} className='cursor-pointer bg-red-500 text-white hover:bg-red-600'>
        Disconnect
      </Button>
    </div>
  );
}
