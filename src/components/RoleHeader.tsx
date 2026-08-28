'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, UserCheck, BookOpen, GraduationCap, Info, X, Menu, LogOut, LogIn, UserPlus } from 'lucide-react';

const ROLES_INFO: { role: UserRole; title: string; defaultRoute: string; icon: any; desc: string }[] = [
  {
    role: 'Admin',
    title: 'System Administrator',
    defaultRoute: '/admin/dashboard',
    icon: ShieldCheck,
    desc: 'Full platform management, user role promotion, system stats, & blog oversight.',
  },
  {
    role: 'Content Manager',
    title: 'Content Director',
    defaultRoute: '/content-manager/dashboard',
    icon: BookOpen,
    desc: 'Platform-wide course/lesson authoring, blog draft & publishing workflow.',
  },
  {
    role: 'Instructor',
    title: 'Course Instructor',
    defaultRoute: '/instructor/dashboard',
    icon: UserCheck,
    desc: 'Manages owned courses, lessons, quizzes, & student roster progress.',
  },
  {
    role: 'Student',
    title: 'Enrolled Learner',
    defaultRoute: '/student/dashboard',
    icon: GraduationCap,
    desc: 'Discovers & enrolls in courses, sequential lesson player, auto-graded quizzes.',
  },
];

export const RoleHeader: React.FC = () => {
  const { activeRole, switchRole, currentUser, isAuthenticated, logout } = useLMS();
  const [showMatrix, setShowMatrix] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleRoleChange = (targetRole: UserRole, targetRoute: string) => {
    switchRole(targetRole);
    router.push(targetRoute);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#141d2b] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo Header */}
        <div className="flex items-center space-x-3">
          <BrandLogo size="md" />
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium bg-[#1a2436] text-[#60a5fa] border border-slate-800 rounded-md">
            LMS Platform
          </span>
        </div>

        {/* Desktop 4-Role Quick Switcher */}
        <div className="hidden md:flex items-center bg-[#1a2436] p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400 px-3 hidden lg:inline-block">
            Persona Switcher:
          </span>
          <div className="flex items-center space-x-1">
            {ROLES_INFO.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleChange(r.role, r.defaultRoute)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                  title={r.desc}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{r.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Actions & Auth */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMatrix(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a2436] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Info className="w-4 h-4 text-[#3b82f6]" />
            <span>Matrix</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:flex items-center space-x-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                />
                <span className="text-xs font-semibold text-white max-w-[100px] truncate">{currentUser.name}</span>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <Link
                href="/login"
                className="px-3 py-1.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="hidden sm:flex px-3 py-1.5 bg-[#1a2436] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold items-center space-x-1.5 border border-slate-800 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#1a2436] border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Persona Switcher */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 mt-3 border-t border-slate-800/80 animate-fadeIn space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-1">
            Select Persona:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {ROLES_INFO.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleChange(r.role, r.defaultRoute)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-[#3b82f6] border-[#3b82f6] text-white'
                      : 'bg-[#1a2436] border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{r.role}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Permission Matrix Modal */}
      {showMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
              <div className="flex items-center space-x-2">
                <BrandLogo size="sm" showText={false} />
                <h3 className="text-base sm:text-lg font-bold text-white">Strict 4-Role Access Matrix</h3>
              </div>
              <button
                onClick={() => setShowMatrix(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300 min-w-[500px]">
                <thead className="bg-[#1a2436] text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3 text-center">Admin (/admin/*)</th>
                    <th className="px-4 py-3 text-center">Content Manager (/content-manager/*)</th>
                    <th className="px-4 py-3 text-center">Instructor (/instructor/*)</th>
                    <th className="px-4 py-3 text-center">Student (/student/*)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Manage users & assign roles</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Create / edit / delete any course</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-semibold">Own only</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Add / edit / delete lessons</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-semibold">Own courses</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Create quizzes</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-semibold">Own courses</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">View student progress</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-semibold">Own courses</td>
                    <td className="px-4 py-3 text-center text-indigo-400 font-semibold">Own only</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Write / manage blog posts</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Enroll in a course</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Take quizzes</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-rose-500 font-bold">❌</td>
                    <td className="px-4 py-3 text-center text-emerald-400 font-bold">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMatrix(false)}
                className="px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
