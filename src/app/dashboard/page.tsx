'use client';

import React from 'react';
import { useLMS } from '../../context/LMSContext';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { activeRole, currentUser, courses, getCourseProgress, blogPosts } = useLMS();

  // Enrolled courses for current user if student
  const enrolledCourses = courses.filter((c) =>
    currentUser.enrolledCourseIds?.includes(c.id)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome back, {currentUser.name}!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {activeRole === 'Admin' && 'System Administrator Command Center'}
              {activeRole === 'Content Manager' && 'Content Director & Course Publishing Hub'}
              {activeRole === 'Instructor' && 'Instructor Portal & Student Progress Hub'}
              {activeRole === 'Student' && 'My Personal Learning Journey'}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              You are logged in with the <strong className="text-indigo-400">{activeRole}</strong> persona. Route-based security navigation is active.
            </p>
          </div>

          {/* Role specific quick action button */}
          <div className="shrink-0">
            {activeRole === 'Admin' && (
              <Link
                href="/admin"
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-rose-500/25 flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Manage User Roles</span>
              </Link>
            )}

            {activeRole === 'Content Manager' && (
              <Link
                href="/courses"
                className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/25 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage Platform Courses</span>
              </Link>
            )}

            {activeRole === 'Instructor' && (
              <Link
                href="/courses"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage My Courses</span>
              </Link>
            )}

            {activeRole === 'Student' && (
              <Link
                href="/my-courses"
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl text-xs shadow-lg shadow-indigo-500/25 flex items-center space-x-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Continue Learning</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Total Platform Courses</span>
          <div className="text-2xl font-extrabold text-white mt-1">{courses.length}</div>
          <span className="text-[11px] text-slate-400">All available modules</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Your Persona Scope</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{activeRole}</div>
          <span className="text-[11px] text-slate-400">Role permissions active</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Published Blog Articles</span>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {blogPosts.filter((b) => b.status === 'Published').length}
          </div>
          <span className="text-[11px] text-slate-400">Public technical insights</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400">Enrolled Courses</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {activeRole === 'Student' ? enrolledCourses.length : 'N/A (Student Role)'}
          </div>
          <span className="text-[11px] text-slate-400">Active enrollments</span>
        </div>
      </div>

      {/* Student In-Progress Section */}
      {activeRole === 'Student' && enrolledCourses.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>In Progress Courses</span>
            </h3>
            <Link
              href="/my-courses"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View All My Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCourses.slice(0, 2).map((course) => {
              const progressPct = getCourseProgress(currentUser.id, course.id);
              return (
                <div key={course.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{course.title}</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Courses Showcase */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Featured Platform Courses</span>
          </h3>
          <Link
            href="/courses"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.slice(0, 3).map((course) => (
            <div key={course.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full h-32 rounded-lg object-cover"
              />
              <h4 className="font-bold text-white text-xs line-clamp-1">{course.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{course.description}</p>
              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                <span>Instructor: {course.instructorName}</span>
                <span className="font-bold text-emerald-400">${course.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
