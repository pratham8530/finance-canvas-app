
import React from 'react';
import { SideNavigation } from './SideNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && <SideNavigation />}
      <main className="flex-1 p-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-6xl">
          {isMobile && <SideNavigation />}
          {children}
        </div>
      </main>
    </div>
  );
}
