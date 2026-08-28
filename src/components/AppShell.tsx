'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RoleHeader } from './RoleHeader';
import { Navbar } from './Navbar';
import { useLMS } from '../context/LMSContext';
import { useToast } from '../context/ToastContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, isLoading, currentUser } = useLMS();

  const isLandingPage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!isLandingPage) return;
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  // Basic Unauthenticated Route Protection only
  React.useEffect(() => {
    if (isLoading) return;

    // If unauthenticated visitor tries to visit internal dashboard routes, send to login
    if (!isAuthenticated && !isLandingPage && !isAuthPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, isLandingPage, isAuthPage, router]);

  // Standalone Auth Pages (Login & Register have their own full-page luxury UI)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If loading session on protected routes, show smooth dark loader
  if (!isLandingPage && !isAuthPage && (isLoading || !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Verifying security session...</span>
      </div>
    );
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
        {/* Full-width Landing Page Content. Header and Footer are handled inside page.tsx */}
        <main className="flex-1 w-full bg-slate-950">
          {children}
        </main>
      </div>
    );
  }

  // Dashboard / Portal Layout (Dark theme with Sidebar & Persona Role Switcher)
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <RoleHeader />
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-8">
        <Navbar />
        <main className="flex-1 min-w-0 space-y-8">{children}</main>
      </div>
    </div>
  );
};
