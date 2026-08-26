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
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, courses, updateUserRole, activeRole } = useLMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  if (activeRole !== 'Admin') {
    return (
      <div className="p-8 sm:p-12 text-center glass-panel rounded-3xl border border-rose-500/30">
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise LMS Overview</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard Overview & System Controls</h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              Real-time platform financial performance, active user growth curves, activity logs, and 4-role access matrix security management.
            </p>
          </div>
        </div>
      </div>

      {/* 1. TOP STAT CARDS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Revenue */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Revenue</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">$124,592</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.5% from last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Active Users</span>
            <div className="text-2xl font-extrabold text-indigo-300 mt-1">8,429</div>
            <div className="text-[11px] text-indigo-400 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+5.2% from last week</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Active Courses */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Active Courses</span>
            <div className="text-2xl font-extrabold text-purple-300 mt-1">156</div>
            <div className="text-[11px] text-purple-300 font-medium mt-1">
              23 completed this week
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Conversion Rate</span>
            <div className="text-2xl font-extrabold text-amber-300 mt-1">3.24%</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+0.8% from last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. PLATFORM ANALYTICS CHARTS */}
      <PlatformAnalyticsCharts />

      {/* 3. REVENUE ANALYTICS & RECENT ACTIVITY FEED */}
      <DashboardFinancialsAndActivity />

      {/* 4. USER ROLE MANAGEMENT & SECURITY TABLE */}
      <div className="glass-panel rounded-3xl border border-slate-800/60 overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Security Access & User Role Management</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Assign or reassign user security roles instantly with live propagation across all route guards.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input text-xs pl-9 pr-3.5 py-2 rounded-xl w-60"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass-input text-xs px-3.5 py-2 rounded-xl bg-slate-900/90 text-slate-200 border-slate-700/80 font-medium"
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
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono border-b border-slate-800/60">
              <tr>
                <th className="px-6 py-3.5">User Details</th>
                <th className="px-6 py-3.5">Current Role</th>
                <th className="px-6 py-3.5">Enrolled / Status</th>
                <th className="px-6 py-3.5">Reassign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map((user) => {
                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3.5">
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
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {user.role === 'Student' ? (
                        <span>{user.enrolledCourseIds?.length || 0} Courses Enrolled</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Active Staff</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="glass-input text-xs px-3 py-1.5 rounded-xl bg-slate-950 text-indigo-300 border-indigo-500/30 cursor-pointer font-medium"
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
