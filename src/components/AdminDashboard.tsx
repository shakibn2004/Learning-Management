'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole, User } from '../types';
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  ShieldAlert,
  UserCheck,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, courses, blogPosts, updateUserRole, deleteCourse, deleteBlogPost, activeRole } = useLMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  if (activeRole !== 'Admin') {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-rose-500/30">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-1">Access Restricted</h2>
        <p className="text-sm text-slate-400">
          The Admin Control Panel is strictly restricted to users with the <strong className="text-rose-400">Admin</strong> role. Please use the top header switcher to select the Admin persona.
        </p>
      </div>
    );
  }

  // Stats calculations
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'Admin').length;
  const cmCount = users.filter((u) => u.role === 'Content Manager').length;
  const instructorCount = users.filter((u) => u.role === 'Instructor').length;
  const studentCount = users.filter((u) => u.role === 'Student').length;
  const totalCourses = courses.length;

  let totalEnrollments = 0;
  users.forEach((u) => {
    totalEnrollments += u.enrolledCourseIds?.length || 0;
  });

  const totalRevenue = courses.reduce((acc, c) => acc + c.price * totalEnrollments, 0);

  // User list filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Administration</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Control & Platform Analytics</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Full administrative override. Manage platform user security roles, oversee global course publications, inspect enrollment metrics, and control system content.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalUsers}</div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">{studentCount} Students</span> • {instructorCount} Instructors
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Active Courses</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalCourses}</div>
          <div className="mt-2 text-[11px] text-slate-400">
            {courses.filter((c) => c.published).length} Published Courses
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Enrollments</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{totalEnrollments}</div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+24% from last month</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Est. Platform Volume</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Gross platform value</div>
        </div>
      </div>

      {/* Role Distribution Bar Visualization */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">User Role Breakdown & Security Distribution</h3>
          </div>
          <span className="text-xs text-slate-400">4 Core Role Scopes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <span className="text-[10px] uppercase font-mono font-semibold text-rose-400">Admins</span>
            <div className="text-xl font-bold text-white mt-1">{adminCount}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-rose-500 h-full" style={{ width: `${(adminCount / totalUsers) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl">
            <span className="text-[10px] uppercase font-mono font-semibold text-amber-400">Content Managers</span>
            <div className="text-xl font-bold text-white mt-1">{cmCount}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${(cmCount / totalUsers) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl">
            <span className="text-[10px] uppercase font-mono font-semibold text-indigo-400">Instructors</span>
            <div className="text-xl font-bold text-white mt-1">{instructorCount}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${(instructorCount / totalUsers) * 100}%` }}></div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
            <span className="text-[10px] uppercase font-mono font-semibold text-emerald-400">Students</span>
            <div className="text-xl font-bold text-white mt-1">{studentCount}</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${(studentCount / totalUsers) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* User Role Management Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">User Management & Role Assignment</h3>
            <p className="text-xs text-slate-400">Assign or reassign user security roles instantly with live propagation.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input text-xs pl-9 pr-3 py-2 rounded-xl w-60"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass-input text-xs px-3 py-2 rounded-xl bg-slate-900 text-slate-200"
            >
              <option value="ALL">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Content Manager">Content Manager</option>
              <option value="Instructor">Instructor</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">User Details</th>
                <th className="px-5 py-3">Current Role</th>
                <th className="px-5 py-3">Enrolled / Auth</th>
                <th className="px-5 py-3">Reassign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-slate-400 text-[11px]">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          user.role === 'Admin'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : user.role === 'Content Manager'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : user.role === 'Instructor'
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {user.role === 'Student' ? (
                        <span>{user.enrolledCourseIds?.length || 0} Courses Enrolled</span>
                      ) : (
                        <span>System User</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="glass-input text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 text-indigo-300 border-indigo-500/30 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Content Manager">Content Manager</option>
                        <option value="Instructor">Instructor</option>
                        <option value="Student">Student</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Course Overview & Control */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Global Platform Courses Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.id} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {course.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">${course.price}</span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{course.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Instructor: {course.instructorName}</span>
                  <span>{course.lessons.length} Lessons</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Status: {course.published ? 'Published' : 'Draft'}</span>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                  title="Admin Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
