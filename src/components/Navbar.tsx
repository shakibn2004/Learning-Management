'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Award,
  GraduationCap,
  Users,
  Settings,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeRole, currentUser, isAuthenticated, logout } = useLMS();
  const pathname = usePathname();

  // Role-namespaced navigation menus with clear, vibrant labels
  const navMenus = {
    Admin: [
      { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Users & Roles', icon: Users },
      { path: '/admin/courses', label: 'Courses & Modules', icon: BookOpen },
      { path: '/admin/blogs', label: 'Publications', icon: Newspaper },
    ],
    'Content Manager': [
      { path: '/content-manager/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/content-manager/courses', label: 'Course Authoring', icon: BookOpen },
      { path: '/content-manager/gradebook', label: 'Student Gradebook', icon: Award },
      { path: '/content-manager/blogs', label: 'Blog Articles', icon: Newspaper },
    ],
    Instructor: [
      { path: '/instructor/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/instructor/courses', label: 'My Courses', icon: BookOpen },
      { path: '/instructor/gradebook', label: 'Student Roster', icon: Award },
    ],
    Student: [
      { path: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/student/catalog', label: 'Course Catalog', icon: BookOpen },
      { path: '/student/my-courses', label: 'My Learning', icon: GraduationCap },
      { path: '/student/blogs', label: 'Articles & Tips', icon: Newspaper },
    ],
  };

  const currentNav = navMenus[activeRole] || navMenus.Admin;

  return (
    <aside className="w-full lg:w-64 bg-[#141d2b] border border-slate-800/80 shrink-0 p-4 sm:p-5 flex flex-col justify-between lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl z-30 shadow-lg shadow-black/20">
      <div className="space-y-4 lg:space-y-6">
        {/* Brand Logo Header */}
        <div className="hidden lg:block px-1 pb-2 border-b border-slate-800/80">
          <BrandLogo size="md" />
        </div>

        {/* Navigation items */}
        <div className="flex lg:flex-col items-center lg:items-stretch overflow-x-auto lg:overflow-x-visible gap-1.5 pb-1 lg:pb-0 scrollbar-none">
          <span className="hidden lg:block text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
            Navigation Menu
          </span>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 shrink-0 lg:shrink group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3b82f6]/20 to-blue-500/10 text-[#60a5fa] border-[#3b82f6]/40 shadow-sm shadow-blue-500/10'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1a2436]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-[#3b82f6] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-[#1a2436] text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Card at Bottom */}
      <div className="hidden lg:flex pt-4 border-t border-slate-800/80 items-center justify-between px-1">
        {isAuthenticated ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#141d2b]"></span>
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
                <span className="text-[10px] text-slate-400 truncate block font-medium">{activeRole}</span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Link
              href="/login"
              className="w-full py-2 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};
