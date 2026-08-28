'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { UserRole } from '../types';
import { PlatformAnalyticsCharts } from './PlatformAnalyticsCharts';
import { DashboardFinancialsAndActivity } from './DashboardFinancialsAndActivity';
import {
  Users,
  BookOpen,
  DollarSign,
  ShieldAlert,
  Search,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, courses, currentUser, updateUserRole, activeRole } = useLMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  if (activeRole !== 'Admin') {
    return (
      <div className="p-8 sm:p-12 text-center bg-[#141d2b] rounded-2xl border border-rose-500/30">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-1">Access Restricted</h2>
        <p className="text-sm text-slate-400">
          The Admin Control Panel is strictly restricted to users with the <strong className="text-rose-400">Admin</strong> role. Please use the top header switcher to select the Admin persona.
        </p>
      </div>
    );
  }

  // User list filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate live database metrics
  const totalRevenue = users
    .filter((u) => u.role === 'Student')
    .reduce((acc, student) => {
      const studentCourses = courses.filter((c) => student.enrolledCourseIds?.includes(c.id));
      const studentTotal = studentCourses.reduce((sum, c) => sum + (c.price || 0), 0);
      return acc + studentTotal;
    }, 0);

  const totalEnrollments = users
    .filter((u) => u.role === 'Student')
    .reduce((acc, u) => acc + (u.enrolledCourseIds?.length || 0), 0);

  const studentCount = users.filter((u) => u.role === 'Student').length;
  const conversionRate = users.length > 0 ? ((studentCount / users.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Welcome back, {currentUser.name}</p>
        </div>
      </div>

      {/* 1. TOP 4 STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Platform Value</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">
              {totalEnrollments} active enrollments
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Active Users</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{users.length}</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">
              Across 4 system roles
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Projects / Courses */}
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Published Courses</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{courses.length}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">
              {courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)} video & text lessons
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Student Learner Ratio</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">{conversionRate}%</div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">
              {studentCount} student accounts
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. PLATFORM ANALYTICS CHARTS */}
      <PlatformAnalyticsCharts />

      {/* 3. RECENT TEAM ACTIVITY & TEAM MEMBERS WITH QUICK ACTIONS */}
      <DashboardFinancialsAndActivity />

      {/* 4. USER ROLE MANAGEMENT TABLE */}
      <div className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
              <ShieldCheck className="w-5 h-5 text-[#3b82f6]" />
              <span>User Role Management & Permissions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage platform accounts, security clearance, and role assignments directly in Strapi.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a2436] text-xs pl-9 pr-3.5 py-2 rounded-xl w-56 text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#1a2436] text-xs px-3.5 py-2 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
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
            <thead className="bg-[#1a2436] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Current Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Reassign Role (Backend Sync)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => {
                return (
                  <tr key={user.id} className="hover:bg-[#1a2436]/50 transition-colors">
                    <td className="px-6 py-3.5 flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-slate-400 text-[11px]">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          user.role === 'Admin'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : user.role === 'Content Manager'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : user.role === 'Instructor'
                            ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400 font-mono">
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="bg-[#1a2436] text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
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
    </div>
  );
};
