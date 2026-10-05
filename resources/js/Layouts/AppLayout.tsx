import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import BottomNav from '@/Components/BottomNav';
import FlashMessage from '@/Components/FlashMessage';
import { cn } from '@/Utils/cn';

interface AppLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  // Persisted Desktop Sidebar Minimize State
  const [sidebarMinimized, setSidebarMinimized] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidata_sidebar_minimized') === 'true';
    }
    return false;
  });

  const toggleSidebarMinimize = () => {
    setSidebarMinimized((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidata_sidebar_minimized', String(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[var(--neu-bg)] font-sans text-slate-800 antialiased dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Head title={title} />

      {/* Desktop Sidebar (Minimizable, Hidden on Mobile) */}
      <Sidebar 
        isMinimized={sidebarMinimized} 
      />

      {/* Main Content Area (Adapts margin based on minimized sidebar) */}
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        sidebarMinimized ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Navbar 
          isMinimized={sidebarMinimized}
          onToggleMinimize={toggleSidebarMinimize} 
        />

        {/* Generous pb-24 on mobile prevents floating BottomNav from obscuring page content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile-Only Bottom Navigation Bar */}
      <BottomNav />

      {/* System Toast / Flash Messages */}
      <FlashMessage />
    </div>
  );
}
