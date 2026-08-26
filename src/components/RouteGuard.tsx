'use client';

import React, { useEffect, useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ allowedRoles, children }) => {
  const { activeRole, switchRole } = useLMS();
  const pathname = usePathname();
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto sync role if route has dedicated single role (e.g. /admin/* -> Admin, /student/* -> Student)
  useEffect(() => {
    if (allowedRoles.length === 1 && !allowedRoles.includes(activeRole)) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        switchRole(allowedRoles[0]);
        setIsSyncing(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname, activeRole, allowedRoles, switchRole]);

  // Role default routes map
  const roleRoutes: Record<UserRole, string> = {
    Admin: '/admin/dashboard',
    'Content Manager': '/content-manager/dashboard',
    Instructor: '/instructor/dashboard',
    Student: '/student/dashboard',
  };

  const defaultRoleRoute = roleRoutes[activeRole] || '/admin/dashboard';
  const targetRequiredRole = allowedRoles[0];

  if (!allowedRoles.includes(activeRole)) {
    if (isSyncing || allowedRoles.length === 1) {
      // Smooth transition while switching persona routes instead of flashing 403 error
      return (
        <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800 space-y-3 animate-fadeIn my-8">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-mono">Updating persona route & access permissions...</p>
        </div>
      );
    }

    return (
      <div className="p-8 sm:p-12 text-center glass-panel rounded-3xl border border-rose-500/30 space-y-4 max-w-2xl mx-auto my-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white">403 - Restricted Route Access</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          This route is protected by strict Role-Based Access Control (RBAC). Your active persona (<strong className="text-rose-400">{activeRole}</strong>) does not have permission to view this page.
        </p>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1 font-mono">
          <div><strong className="text-slate-400">Required Role(s):</strong> {allowedRoles.join(', ')}</div>
          <div><strong className="text-slate-400">Your Active Persona:</strong> {activeRole}</div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => switchRole(targetRequiredRole)}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Switch to {targetRequiredRole} Persona</span>
          </button>

          <Link
            href={defaultRoleRoute}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {activeRole} Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
