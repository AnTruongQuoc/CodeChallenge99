'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import AppLogo from '@/shared/components/Logos/AppLogo';
import { cn } from '@/shared/libs/utils';

import { headerItems } from './headerItems';

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className='bg-background flex h-16 max-h-16'>
      <div className='container mx-auto px-4 py-4'>
        <nav className='flex items-center justify-between'>
          <AppLogo />
          <ul className='flex items-center gap-4'>
            {headerItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'text-foreground hover:text-primary text-sm font-medium',
                      isActive && 'text-indigo-400',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
