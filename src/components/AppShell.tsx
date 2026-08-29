'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RoleHeader } from './RoleHeader';
import { Navbar } from './Navbar';
import { useLMS } from '../context/LMSContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck } from 'lucide-react';

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

  // Premium loading spinner while verifying security session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex flex-col items-center justify-center relative overflow-hidden select-none">
        {/* Ambient background glow aura */}
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Dual-orbit animated spinner with centered brand element */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-5">
            {/* Outer high-speed ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin" style={{ animationDuration: '1.1s' }} />
            {/* Middle counter-rotating ring */}
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-indigo-400 border-l-cyan-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.7s' }} />
            {/* Inner pulsing core with shield */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Status badge with pulsing dot */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141d2b] border border-slate-800 shadow-inner mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-medium text-slate-300">Verifying Security Session</span>
          </div>

          <p className="text-[11px] text-slate-500 font-sans tracking-wide">
            Connecting to cloud database & checking permissions...
          </p>
        </div>
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
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
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
