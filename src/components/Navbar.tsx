'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  ShieldCheck,
  Award,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeRole, currentUser } = useLMS();
  const pathname = usePathname();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Content Manager', 'Instructor', 'Student'],
    },
    {
      path: '/courses',
      label: activeRole === 'Student' ? 'Course Catalog' : 'Course Management',
      icon: BookOpen,
      roles: ['Admin', 'Content Manager', 'Instructor', 'Student'],
    },
    {
      path: '/my-courses',
      label: 'My Enrolled Courses',
      icon: GraduationCap,
      roles: ['Student'],
    },
    {
      path: '/gradebook',
      label: 'Student Progress',
      icon: Award,
      roles: ['Admin', 'Content Manager', 'Instructor'],
    },
    {
      path: '/blogs',
      label: 'Blog & Content',
      icon: Newspaper,
      roles: ['Admin', 'Content Manager', 'Instructor', 'Student'],
    },
    {
      path: '/admin',
      label: 'Admin Control Panel',
      icon: ShieldCheck,
      roles: ['Admin'],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(activeRole));

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-slate-800/80 shrink-0 p-4 flex flex-col justify-between lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-2xl">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{currentUser.name}</h4>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-medium text-slate-400">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Nav list */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Navigation Menu
          </p>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Role permission status banner */}
      <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20">
        <div className="flex items-center space-x-2 text-indigo-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">RBAC Scope</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Logged in as <strong className="text-white">{activeRole}</strong>. Route guard & API actions strictly enforced.
        </p>
      </div>
    </aside>
  );
};
