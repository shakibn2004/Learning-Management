'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, BookOpen, GraduationCap, Info, X } from 'lucide-react';

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
  const { activeRole, switchRole, currentUser } = useLMS();
  const [showMatrix, setShowMatrix] = useState(false);
  const router = useRouter();

  const handleRoleChange = (targetRole: UserRole, targetRoute: string) => {
    switchRole(targetRole);
    router.push(targetRoute);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#141d2b] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo matching 1st reference image (SaaSPro) */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                SaaS<span className="text-[#3b82f6]">Pro</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-[#1a2436] text-[#60a5fa] border border-slate-800 rounded-md">
                LMS Platform
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic 4-Role Quick Switcher */}
        <div className="flex items-center bg-[#1a2436] p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-medium text-slate-400 px-3 hidden xl:inline-block">
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

        {/* Role Matrix Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMatrix(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a2436] hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Info className="w-4 h-4 text-[#3b82f6]" />
            <span className="hidden sm:inline">Permission Matrix</span>
          </button>
        </div>
      </div>

      {/* Permission Matrix Modal */}
      {showMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-4xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-[#3b82f6]" />
                <h3 className="text-lg font-bold text-white">Strict 4-Role Access Matrix (Project Spec)</h3>
              </div>
              <button
                onClick={() => setShowMatrix(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
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
