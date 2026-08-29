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
  const isPublicRoute = isLandingPage || isAuthPage;

  // Strict Route Protection: If user is not authenticated, send them directly to /login
  React.useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, isPublicRoute, router]);

  // Standalone Auth Pages (Login / Register)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show dark loader while verifying initial session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Verifying session...</span>
      </div>
    );
  }

  // Public Landing Page
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
        <main className="flex-1 w-full bg-slate-950">
          {children}
        </main>
      </div>
    );
  }

  // If unauthenticated and trying to access protected dashboard routes, hold with spinner until redirected to /login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Redirecting to login...</span>
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
