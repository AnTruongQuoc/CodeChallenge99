import { AppHeader } from '@/shared/components/Header';

import { Toaster } from '../ui/sonner';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-background flex h-dvh flex-col'>
      <AppHeader />
      <main className='flex-1'>{children}</main>
      <Toaster richColors position='top-center' />
    </div>
  );
}
