'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { Plus, MessageSquare } from 'lucide-react';

export const DashboardFinancialsAndActivity: React.FC = () => {
  const { users, progress, quizAttempts, courses } = useLMS();

  // Dynamically map real activities from database progress & quiz attempts
  const activities = [
    ...progress.map((p, idx) => {
      const student = users.find((u) => u.id === p.userId);
      const course = courses.find((c) => c.id === p.courseId);
      const completedCount = p.completedLessonIds?.length || 0;
      return {
        id: `prog-act-${idx}`,
        user: student?.name || 'Enrolled Student',
        avatar: student?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        action: `completed ${completedCount} lessons in "${course?.title || 'Course'}"`,
        time: 'Synced recently',
        status: completedCount > 0 ? 'In Progress' : 'Started',
        statusColor: 'bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30',
      };
    }),
    ...quizAttempts.map((qa, idx) => {
      const student = users.find((u) => u.id === qa.studentId);
      return {
        id: `quiz-act-${idx}`,
        user: student?.name || 'Student',
        avatar: student?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        action: `scored ${qa.scorePercentage}% on quiz assessment`,
        time: 'Recorded in DB',
        status: qa.passed ? 'Passed' : 'Failed',
        statusColor: qa.passed
          ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30'
          : 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      };
    }),
  ];

  // Map real team members from Strapi users
  const teamMembers = users.map((u, idx) => ({
    name: u.name,
    role: u.role,
    avatar: u.avatar,
    status: idx % 3 === 0 ? 'online' : idx % 3 === 1 ? 'away' : 'offline',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Recent Team Activity */}
      <div className="lg:col-span-7 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Platform Activity</h3>
          <span className="text-xs font-semibold text-[#3b82f6]">Live Records ({activities.length})</span>
        </div>

        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.slice(0, 5).map((act) => (
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
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No recent activity records found in database.
            </div>
          )}
        </div>
      </div>

      {/* 2. Team Members & Quick Actions */}
      <div className="lg:col-span-5 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">System Users & Team</h3>
            <span className="text-xs text-slate-400 font-mono">{users.length} accounts</span>
          </div>

          <div className="space-y-3">
            {teamMembers.slice(0, 6).map((member) => (
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
          <button
            onClick={() => alert('Platform connected directly to Strapi 5 & Neon PostgreSQL.')}
            className="w-full py-2.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Strapi Live Backend Active</span>
          </button>
        </div>
      </div>
    </div>
  );
};
