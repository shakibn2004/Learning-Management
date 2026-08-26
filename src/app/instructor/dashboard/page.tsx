'use client';

import React from 'react';
import { useLMS } from '../../../context/LMSContext';
import Link from 'next/link';
import { BookOpen, Award, Users, Plus, Star, Video } from 'lucide-react';
import { ContentManagerDashboard } from '../../../components/ContentManagerDashboard';

export default function InstructorDashboardPage() {
  const { currentUser, courses } = useLMS();
  const ownedCourses = courses.filter((c) => c.instructorId === currentUser.id);
  const totalLessons = ownedCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Title Bar matching Admin & CM */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Instructor Command Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Welcome back, {currentUser.name}! Manage your authored courses, lessons, and student progress rosters.
          </p>
        </div>

        <Link
          href="/instructor/courses"
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Course</span>
        </Link>
      </div>

      {/* TOP 4 STAT CARDS GRID (Unified with Admin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Owned Courses</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{ownedCourses.length}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">Active instructional modules</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Enrolled Students</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">1,240</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">+14% this month</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Lessons Authored</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{totalLessons}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">Video & text modules</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Instructor Rating</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">4.9 ⭐</div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">Top rated educator</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area: Owned Courses & Lessons Manager */}
      <ContentManagerDashboard />
    </div>
  );
}
