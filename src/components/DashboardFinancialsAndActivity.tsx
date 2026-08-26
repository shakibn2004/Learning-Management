'use client';

import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';

export const DashboardFinancialsAndActivity: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      action: 'completed "User Authentication Module"',
      time: '2 hours ago',
      status: 'Completed',
      statusColor: 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30',
    },
    {
      id: 'act-2',
      user: 'Maria Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      action: 'started "Payment Integration"',
      time: '4 hours ago',
      status: 'In Progress',
      statusColor: 'bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30',
    },
    {
      id: 'act-3',
      user: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      action: 'commented on "Dashboard Redesign"',
      time: '6 hours ago',
      status: 'Review',
      statusColor: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
    },
    {
      id: 'act-4',
      user: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      action: 'uploaded design files',
      time: '1 day ago',
      status: 'Design',
      statusColor: 'bg-[#a855f7]/15 text-[#c084fc] border-[#a855f7]/30',
    },
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Project Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    {
      name: 'Alex Chen',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Backend Developer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      status: 'away',
    },
    {
      name: 'David Kim',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      status: 'offline',
    },
    {
      name: 'Emma Wilson',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Recent Team Activity (Left Column matching 1st reference image) */}
      <div className="lg:col-span-7 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Team Activity</h3>
          <span className="text-xs font-semibold text-[#3b82f6] hover:underline cursor-pointer">View All</span>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-4 bg-[#1a2436] rounded-xl border border-slate-800/60 flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3.5">
                <img src={act.avatar} alt={act.user} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                <div>
                  <div className="text-xs text-slate-200">
                    <strong className="text-white font-semibold">{act.user}</strong> {act.action}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-md text-[10px] font-semibold border shrink-0 ${act.statusColor}`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Team Members & Quick Actions (Right Column matching 1st reference image) */}
      <div className="lg:col-span-5 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">Team Members</h3>
            <button className="text-[#3b82f6] hover:text-blue-400 p-1">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                  <div>
                    <div className="text-xs font-semibold text-white">{member.name}</div>
                    <div className="text-[10px] text-slate-400">{member.role}</div>
                  </div>
                </div>

                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    member.status === 'online'
                      ? 'bg-[#10b981]'
                      : member.status === 'away'
                      ? 'bg-[#f59e0b]'
                      : 'bg-slate-600'
                  }`}
                ></span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions at Bottom */}
        <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Quick Actions</span>
          <button className="w-full py-2.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4" />
            <span>+ New Project</span>
          </button>
          <button className="w-full py-2.5 px-4 bg-[#1a2436] hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-800/80">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Team Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
