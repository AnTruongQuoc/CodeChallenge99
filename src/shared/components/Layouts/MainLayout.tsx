import { AppHeader } from '@/shared/components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-background flex h-dvh flex-col'>
      <AppHeader />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
