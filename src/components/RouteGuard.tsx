'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ allowedRoles, children }) => {
  const { activeRole } = useLMS();

  if (!allowedRoles.includes(activeRole)) {
    return (
      <div className="p-8 sm:p-12 text-center glass-panel rounded-3xl border border-rose-500/30 space-y-4 max-w-2xl mx-auto my-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white">403 - Restricted Route Access</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested route is protected by backend-style Role-Based Access Control (RBAC). Your current persona (<strong className="text-rose-400">{activeRole}</strong>) does not have authorization to view this page.
        </p>

        <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-300 text-left space-y-1 font-mono">
          <div><strong className="text-slate-400">Required Roles:</strong> {allowedRoles.join(', ')}</div>
          <div><strong className="text-slate-400">Your Persona:</strong> {activeRole}</div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
