'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  Plus,
  MessageSquare,
} from 'lucide-react';

export const DashboardFinancialsAndActivity: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      user: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      action: 'Completed lesson "Next.js App Router & Server Components"',
      time: '2 hours ago',
      status: 'Completed',
      statusColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'act-2',
      user: 'Dr. Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      action: 'Published new quiz "Next.js 14 & Strapi Architecture Assessment"',
      time: '4 hours ago',
      status: 'In Progress',
      statusColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'act-3',
      user: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      action: 'Submitted quiz response for "UI/UX Principles Checkup"',
      time: '6 hours ago',
      status: 'Review',
      statusColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    },
    {
      id: 'act-4',
      user: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      action: 'Updated blog article draft "AI-Powered Adaptive Quiz Generation"',
      time: '1 day ago',
      status: 'Design',
      statusColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    },
  ];

  const teamMembers = [
    {
      name: 'Alex Rivera',
      role: 'System Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    {
      name: 'Sophia Chen',
      role: 'Content Manager',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'Senior Instructor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      status: 'away',
    },
    {
      name: 'Sarah Jenkins',
      role: 'Lead UI/UX Instructor',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'offline',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Revenue Analytics Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/60 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Revenue Analytics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Platform enrollment revenue, order value, and subscription breakdown.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-full">
            +12.5% vs Last Month
          </span>
        </div>

        {/* 4 Sub Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-400">Total Revenue</span>
            <div className="text-xl font-bold text-white mt-1">$124,580</div>
            <span className="text-[10px] text-emerald-400 font-medium">+12.5% from last month</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-400">Monthly Growth</span>
            <div className="text-xl font-bold text-indigo-300 mt-1">8.3%</div>
            <span className="text-[10px] text-indigo-400 font-medium">+2.1% from last month</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-400">Average Order</span>
            <div className="text-xl font-bold text-amber-300 mt-1">$89.50</div>
            <span className="text-[10px] text-rose-400 font-medium">-3.2% from last month</span>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/60">
            <span className="text-[11px] font-medium text-slate-400">Conversion Rate</span>
            <div className="text-xl font-bold text-purple-300 mt-1">3.7%</div>
            <span className="text-[10px] text-emerald-400 font-medium">+0.8% from last month</span>
          </div>
        </div>

        {/* Revenue by Source & Top Performing Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Revenue by Source */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Revenue by Source
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-slate-300">Direct Course Sales</span>
                <span className="font-mono font-semibold text-white">$52,340 <span className="text-slate-500 font-normal">(42%)</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-slate-300">Online Store / Certifications</span>
                <span className="font-mono font-semibold text-white">$38,920 <span className="text-slate-500 font-normal">(31%)</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-slate-300">University Partnerships</span>
                <span className="font-mono font-semibold text-white">$21,180 <span className="text-slate-500 font-normal">(17%)</span></span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-slate-300">Monthly Subscriptions</span>
                <span className="font-mono font-semibold text-white">$12,140 <span className="text-slate-500 font-normal">(10%)</span></span>
              </div>
            </div>
          </div>

          {/* Top Performing Courses */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Top Performing Courses
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-white font-medium line-clamp-1">Full-Stack Next.js 14 Masterclass</span>
                <span className="font-mono font-bold text-emerald-400">$18,450</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-white font-medium line-clamp-1">Advanced UI/UX Glassmorphism</span>
                <span className="font-mono font-bold text-emerald-400">$15,230</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-white font-medium line-clamp-1">Cloud Microservices on Railway</span>
                <span className="font-mono font-bold text-emerald-400">$12,890</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-white font-medium line-clamp-1">TypeScript Architecture Basics</span>
                <span className="font-mono font-bold text-emerald-400">$9,670</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recent Activity & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Team & Student Activity</h3>
            </div>
            <span className="text-xs font-medium text-indigo-400 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/60 flex items-center justify-between gap-4 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-center space-x-3.5">
                  <img src={act.avatar} alt={act.user} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                  <div>
                    <div className="text-xs font-normal text-slate-200">
                      <strong className="text-white font-semibold">{act.user}</strong> {act.action}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shrink-0 ${act.statusColor}`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members & Actions */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/60 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Team Members</h3>
              </div>
              <button className="p-1 rounded-lg text-indigo-400 hover:bg-slate-800/60">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                          member.status === 'online'
                            ? 'bg-emerald-400'
                            : member.status === 'away'
                            ? 'bg-amber-400'
                            : 'bg-slate-600'
                        }`}
                      ></span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{member.name}</div>
                      <div className="text-[10px] text-slate-400">{member.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-500">Quick Actions</span>
            <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>+ Create New Course</span>
            </button>
            <button className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Team Announcement</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
