'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, BookOpen, GraduationCap, Info, Sparkles, Check, Lock, ChevronRight, X } from 'lucide-react';

const ROLES_INFO: { role: UserRole; title: string; badgeColor: string; icon: any; desc: string }[] = [
  {
    role: 'Admin',
    title: 'System Administrator',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: ShieldCheck,
    desc: 'Full platform management, user role promotion, system stats, & blog oversight.',
  },
  {
    role: 'Content Manager',
    title: 'Content Director',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: BookOpen,
    desc: 'Platform-wide course/lesson authoring, blog draft & publishing workflow.',
  },
  {
    role: 'Instructor',
    title: 'Course Instructor',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    icon: UserCheck,
    desc: 'Manages owned courses, lessons, quizzes, & student roster progress.',
  },
  {
    role: 'Student',
    title: 'Enrolled Learner',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: GraduationCap,
    desc: 'Discovers & enrolls in courses, sequential lesson player, auto-graded quizzes.',
  },
];

export const RoleHeader: React.FC = () => {
  const { activeRole, switchRole, currentUser } = useLMS();
  const [showMatrix, setShowMatrix] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                LearnHub <span className="gradient-text">LMS</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                Frontend Spec Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              Active User: <span className="text-slate-200 font-medium">{currentUser.name}</span> ({currentUser.email})
            </p>
          </div>
        </div>

        {/* Dynamic 4-Role Quick Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-xs font-semibold text-slate-400 px-3 hidden xl:inline-block">
            Switch Persona:
          </span>
          <div className="flex items-center space-x-1">
            {ROLES_INFO.map((r) => {
              const Icon = r.icon;
              const isActive = activeRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            <Info className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Permission Matrix</span>
          </button>
        </div>
      </div>

      {/* Permission Matrix Modal */}
      {showMatrix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-4xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
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
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3 text-center">Admin</th>
                    <th className="px-4 py-3 text-center">Content Manager</th>
                    <th className="px-4 py-3 text-center">Instructor</th>
                    <th className="px-4 py-3 text-center">Student</th>
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
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
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
