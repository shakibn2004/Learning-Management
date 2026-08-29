'use client';

import React, { useState } from 'react';
import { useLMS } from '../../../context/LMSContext';
import { UserRole } from '../../../types';
import {
  Users,
  Search,
  ShieldCheck,
  UserPlus,
  Filter,
  CheckCircle2,
  Mail,
  Calendar,
  Trash2,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { users, currentUser, updateUserRole, deleteUser, activeRole } = useLMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  if (activeRole !== 'Admin') {
    return (
      <div className="p-8 sm:p-12 text-center bg-[#141d2b] rounded-2xl border border-rose-500/30">
        <h2 className="text-xl font-bold text-white mb-1">Access Restricted</h2>
        <p className="text-sm text-slate-400">
          This page is strictly restricted to <strong className="text-rose-400">Admin</strong> users.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    Admin: users.filter((u) => u.role === 'Admin').length,
    'Content Manager': users.filter((u) => u.role === 'Content Manager').length,
    Instructor: users.filter((u) => u.role === 'Instructor').length,
    Student: users.filter((u) => u.role === 'Student').length,
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    await deleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-cyan-400" />
            <span>User Management & RBAC Permissions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage registered accounts, inspect user profiles, reassign system roles, and remove accounts.
          </p>
        </div>
      </div>

      {/* Role Breakdown Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setRoleFilter(roleFilter === 'Admin' ? 'ALL' : 'Admin')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'Admin'
              ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-500/10'
              : 'bg-[#141d2b] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
            Admins
          </span>
          <div className="text-2xl font-black text-white mt-1">{roleCounts.Admin}</div>
          <span className="text-[10px] text-slate-400">Full System Control</span>
        </div>

        <div
          onClick={() => setRoleFilter(roleFilter === 'Content Manager' ? 'ALL' : 'Content Manager')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'Content Manager'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/10'
              : 'bg-[#141d2b] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
            Content Managers
          </span>
          <div className="text-2xl font-black text-white mt-1">{roleCounts['Content Manager']}</div>
          <span className="text-[10px] text-slate-400">Author & Editorial</span>
        </div>

        <div
          onClick={() => setRoleFilter(roleFilter === 'Instructor' ? 'ALL' : 'Instructor')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'Instructor'
              ? 'bg-purple-500/15 border-purple-500/50 shadow-md shadow-purple-500/10'
              : 'bg-[#141d2b] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
            Instructors
          </span>
          <div className="text-2xl font-black text-white mt-1">{roleCounts.Instructor}</div>
          <span className="text-[10px] text-slate-400">Course Teachers</span>
        </div>

        <div
          onClick={() => setRoleFilter(roleFilter === 'Student' ? 'ALL' : 'Student')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            roleFilter === 'Student'
              ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
              : 'bg-[#141d2b] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
            Students
          </span>
          <div className="text-2xl font-black text-white mt-1">{roleCounts.Student}</div>
          <span className="text-[10px] text-slate-400">Enrolled Learners</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#141d2b] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white">All Platform Users</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredUsers.length}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1a2436] text-xs pl-9 pr-3.5 py-2 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#1a2436] text-xs px-3.5 py-2 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Content Manager">Content Manager</option>
              <option value="Instructor">Instructor</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#1a2436] text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">User Profile</th>
                <th className="px-6 py-3.5">Current Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Enrolled Courses</th>
                <th className="px-6 py-3.5">Assign Role</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a2436]/50 transition-colors">
                  <td className="px-6 py-3.5 flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700 shadow-xs"
                    />
                    <div>
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
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
                          ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono">
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-300">
                    {user.enrolledCourseIds?.length || 0} Courses
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                      className="bg-[#1a2436] text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Content Manager">Content Manager</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Student">Student</option>
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                      disabled={currentUser?.id === user.id}
                      title={currentUser?.id === user.id ? "Cannot remove current admin" : "Remove user"}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-md rounded-2xl border border-slate-700/80 shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Remove User Account</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove <strong className="text-white">{userToDelete.name}</strong> from the database? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-[#1a2436] hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs shadow-md shadow-rose-500/20"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
