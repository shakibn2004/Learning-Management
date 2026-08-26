'use client';

import React from 'react';
import { useLMS } from '../../../context/LMSContext';
import Link from 'next/link';
import { BookOpen, Award, Users, Plus, Sparkles } from 'lucide-react';

export default function InstructorDashboardPage() {
  const { currentUser, courses } = useLMS();
  const ownedCourses = courses.filter((c) => c.instructorId === currentUser.id);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instructor Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome, {currentUser.name}!</h2>
          <p className="text-xs text-slate-400 mt-1">Manage your course curriculum, lessons, quizzes, and student progress rosters.</p>
        </div>

        <Link
          href="/instructor/courses"
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Manage Owned Courses</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Owned Courses</span>
          <div className="text-2xl font-extrabold text-white mt-1">{ownedCourses.length}</div>
          <span className="text-[11px] text-slate-400">Active instructional modules</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Lessons Authored</span>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {ownedCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)}
          </div>
          <span className="text-[11px] text-slate-400">Video & text modules</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Student Progress Roster</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">Active</div>
          <span className="text-[11px] text-slate-400">Track student completion %</span>
        </div>
      </div>
    </div>
  );
}
