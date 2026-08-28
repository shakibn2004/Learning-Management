'use client';

import React, { useState } from 'react';
import { useLMS } from '../../../context/LMSContext';
import { CourseModal } from '../../../components/CourseModal';
import {
  BookOpen,
  Video,
  FileText,
  Award,
  Layers,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function CMDashboardOverviewPage() {
  const { courses, blogPosts, currentUser, activeRole, canPerformAction } = useLMS();
  const [showCourseModal, setShowCourseModal] = useState(false);

  const displayCourses = courses;
  const totalLessons = displayCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const totalQuizzes = displayCourses.filter((c) => !!c.quiz).length;
  const publishedCourses = displayCourses.filter((c) => c.published).length;
  const draftCourses = displayCourses.filter((c) => !c.published).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-cyan-400" />
            <span>Content & Editorial Directorate</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, {currentUser.name}. High-level overview of curriculum assets, draft modules, and editorial pipelines.
          </p>
        </div>

        {canPerformAction('create_course') && (
          <button
            onClick={() => setShowCourseModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Author New Course</span>
          </button>
        )}
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Courses</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{displayCourses.length}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">
              {publishedCourses} Live • {draftCourses} Drafts
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Video Modules</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{totalLessons}</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">Interactive Syllabus</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Auto Quizzes</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{totalQuizzes}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">Knowledge Checks</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Blog Articles</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">
              {blogPosts.length}
            </div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">
              {blogPosts.filter((b) => b.status === 'Published').length} Published
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Curriculum Pipeline Matrix & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Curriculum Asset Inventory */}
        <div className="lg:col-span-7 bg-[#141d2b] rounded-2xl border border-slate-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Asset Inventory</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{displayCourses.length} Courses</span>
          </div>

          <div className="space-y-3">
            {displayCourses.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-[#1a2436] rounded-xl border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={c.coverImage}
                    alt={c.title}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{c.category}</span>
                      <span>•</span>
                      <span>{c.lessons?.length || 0} Lessons</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-medium">${c.price}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                    c.published
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {c.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editorial Publications */}
        <div className="lg:col-span-5 bg-[#141d2b] rounded-2xl border border-slate-800/80 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Editorial Publications</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{blogPosts.length} Articles</span>
          </div>

          <div className="space-y-3">
            {blogPosts.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="p-3 bg-[#1a2436] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{b.title}</h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{b.authorName}</span>
                    <span>•</span>
                    <span className="font-mono">{b.status}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                    b.status === 'Published'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-400 border-slate-700'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}
    </div>
  );
}
