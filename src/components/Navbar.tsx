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
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeRole, currentUser } = useLMS();
  const pathname = usePathname();

  // Role-namespaced navigation menus matching 1st reference image structure
  const navMenus = {
    Admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/users', label: 'Team', icon: Users },
      { path: '/admin/courses', label: 'Projects', icon: BookOpen },
      { path: '/admin/blogs', label: 'Analytics', icon: Newspaper },
    ],
    'Content Manager': [
      { path: '/content-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/content-manager/courses', label: 'Projects', icon: BookOpen },
      { path: '/content-manager/gradebook', label: 'Analytics', icon: Award },
      { path: '/content-manager/blogs', label: 'Editorial', icon: Newspaper },
    ],
    Instructor: [
      { path: '/instructor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/instructor/courses', label: 'Projects', icon: BookOpen },
      { path: '/instructor/gradebook', label: 'Analytics', icon: Award },
    ],
    Student: [
      { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/student/catalog', label: 'Projects', icon: BookOpen },
      { path: '/student/my-courses', label: 'My Courses', icon: GraduationCap },
      { path: '/student/blogs', label: 'Articles', icon: Newspaper },
    ],
  };

  const currentNav = navMenus[activeRole] || navMenus.Admin;

  return (
    <aside className="w-full lg:w-60 bg-[#141d2b] border border-slate-800/80 shrink-0 p-5 flex flex-col justify-between lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl z-30">
      <div className="space-y-6">
        {/* Brand Logo Header featuring SVG Crest matching favicon */}
        <div className="px-1">
          <BrandLogo size="md" />
        </div>

        {/* Clean Menu Items */}
        <div className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                  isActive
                    ? 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/40 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1a2436]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#3b82f6]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => alert('Settings module active in SaaSPro LMS enterprise edition.')}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold border border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#1a2436] transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simplified User Card at Bottom */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-3 px-1">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
        />
        <div className="overflow-hidden">
          <h4 className="text-xs font-semibold text-white truncate">{currentUser.name}</h4>
          <span className="text-[10px] text-slate-400 truncate block">{activeRole}</span>
        </div>
      </div>
    </aside>
  );
};
