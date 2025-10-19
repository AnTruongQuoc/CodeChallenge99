import Link from 'next/link';

import { cn } from '@/shared/libs/utils';

interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn('text-2xl font-bold', className)}>
      <Link href='/'>
        <h1 className='text-foreground'>CodeChallenge</h1>
      </Link>
    </div>
  );
}
