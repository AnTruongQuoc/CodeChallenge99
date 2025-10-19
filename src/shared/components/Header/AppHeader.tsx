import Link from 'next/link';

import AppLogo from '@/shared/components/Logos/AppLogo';

import { headerItems } from './headerItems';

export default function AppHeader() {
  return (
    <header className='bg-background'>
      <div className='container mx-auto px-4 py-4'>
        <nav className='flex items-center justify-between'>
          <AppLogo />
          <ul className='flex items-center gap-4'>
            {headerItems.map(item => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className='text-foreground hover:text-primary text-sm font-medium'
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
