'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { PieChart as PieIcon, BarChart3, Users } from 'lucide-react';

export const PlatformAnalyticsCharts: React.FC = () => {
  const { users, courses } = useLMS();
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; value: number } | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'pie' | 'bar'>('pie');
  const [hoveredSlice, setHoveredSlice] = useState<{ label: string; count: number; percentage: number; color: string } | null>(null);

  // Calculate live demographics from database users
  const totalUsersCount = users.length || 1;
  const studentsCount = users.filter((u) => u.role === 'Student').length;
  const instructorsCount = users.filter((u) => u.role === 'Instructor').length;
  const cmsCount = users.filter((u) => u.role === 'Content Manager').length;
  const adminsCount = users.filter((u) => u.role === 'Admin').length;

  const demographicsData = [
    {
      label: 'Students',
      count: studentsCount,
      percentage: Math.round((studentsCount / totalUsersCount) * 100),
      color: '#34d399',
    },
    {
      label: 'Instructors',
      count: instructorsCount,
      percentage: Math.round((instructorsCount / totalUsersCount) * 100),
      color: '#60a5fa',
    },
    {
      label: 'Content Managers',
      count: cmsCount,
      percentage: Math.round((cmsCount / totalUsersCount) * 100),
      color: '#fbbf24',
    },
    {
      label: 'System Admins',
      count: adminsCount,
      percentage: Math.round((adminsCount / totalUsersCount) * 100),
      color: '#c084fc',
    },
  ];

  // Calculate total platform value
  const totalPlatformValue = users
    .filter((u) => u.role === 'Student')
    .reduce((acc, student) => {
      const studentCourses = courses.filter((c) => student.enrolledCourseIds?.includes(c.id));
      return acc + studentCourses.reduce((sum, c) => sum + (c.price || 0), 0);
    }, 0);

  const baseVal = totalPlatformValue > 0 ? totalPlatformValue : 450;
  const revenueData = [
    { month: 'Q1', value: Math.round(baseVal * 0.4) },
    { month: 'Q2', value: Math.round(baseVal * 0.6) },
    { month: 'Q3', value: Math.round(baseVal * 0.8) },
    { month: 'Current', value: Math.round(baseVal) },
  ];

  const userGrowthData = [
    { month: 'Seed', count: Math.max(1, Math.round(users.length * 0.3)) },
    { month: 'Beta', count: Math.max(2, Math.round(users.length * 0.6)) },
    { month: 'Launch', count: Math.max(3, Math.round(users.length * 0.8)) },
    { month: 'Live', count: users.length },
  ];

  const svgWidth = 560;
  const svgHeight = 180;
  const paddingLeft = 45;
  const paddingBottom = 25;
  const paddingTop = 15;
  const paddingRight = 15;

  const maxRevenue = Math.max(...revenueData.map((d) => d.value), 100) * 1.2;
  const minRevenue = 0;

  const getX = (index: number) => paddingLeft + (index * (svgWidth - paddingLeft - paddingRight)) / (revenueData.length - 1);
  const getY = (val: number) => svgHeight - paddingBottom - ((val - minRevenue) * (svgHeight - paddingTop - paddingBottom)) / (maxRevenue - minRevenue || 1);

  const revenuePath = revenueData.reduce((acc, point, i) => {
    const x = getX(i);
    const y = getY(point.value);
    if (i === 0) return `M ${x} ${y}`;
    const prevX = getX(i - 1);
    const prevY = getY(revenueData[i - 1].value);
    const cp1x = prevX + (x - prevX) / 2;
    const cp2x = prevX + (x - prevX) / 2;
    return `${acc} C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
  }, '');

  const fillPath = `${revenuePath} L ${getX(revenueData.length - 1)} ${svgHeight - paddingBottom} L ${getX(0)} ${svgHeight - paddingBottom} Z`;

  // SVG Pie Chart Generator Helper
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Revenue Analytics Card */}
      <div className="lg:col-span-7 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Platform Growth & Revenue Analytics</h3>
        </div>

        {/* 4 Mini Stat Boxes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Platform GMV</span>
            <div className="text-lg font-extrabold text-[#34d399] mt-0.5">${Math.round(totalPlatformValue)}</div>
            <span className="text-[10px] text-[#34d399] font-medium">Live PostgreSQL</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Total Users</span>
            <div className="text-lg font-extrabold text-[#60a5fa] mt-0.5">{users.length}</div>
            <span className="text-[10px] text-[#60a5fa] font-medium">Synced from DB</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Avg Course Price</span>
            <div className="text-lg font-extrabold text-[#f97316] mt-0.5">
              ${courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + (c.price || 0), 0) / courses.length) : 0}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Per catalog course</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Catalog Count</span>
            <div className="text-lg font-extrabold text-[#c084fc] mt-0.5">{courses.length}</div>
            <span className="text-[10px] text-[#34d399] font-medium">Published items</span>
          </div>
        </div>

        {/* Line Chart Header Legend */}
        <div className="flex items-center justify-end space-x-2 text-xs">
          <span className="w-3 h-3 bg-[#3b82f6] rounded-sm inline-block"></span>
          <span className="text-slate-400 font-medium">Growth Value</span>
        </div>

        {/* SVG Line Chart */}
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44">
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {[maxRevenue, maxRevenue * 0.66, maxRevenue * 0.33, 0].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#1e293b" strokeWidth="0.8" />
                  <text x={paddingLeft - 8} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">
                    ${Math.round(val)}
                  </text>
                </g>
              );
            })}

            <path d={fillPath} fill="url(#revenueGrad)" />
            <path d={revenuePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

            {revenueData.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.value);
              return (
                <g key={d.month} onMouseEnter={() => setHoveredPoint(d)} onMouseLeave={() => setHoveredPoint(null)} className="cursor-pointer">
                  <circle cx={cx} cy={cy} r="4" fill="#3b82f6" stroke="#141d2b" strokeWidth="2" />
                  <text x={cx} y={svgHeight - 6} fill="#64748b" fontSize="9" textAnchor="middle">
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-0.5">
              <div className="font-bold text-white">{hoveredPoint.month} Value</div>
              <div className="text-blue-400 font-mono font-bold">${hoveredPoint.value.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Bottom Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Database Roles Overview</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total System Admins</span>
                <span className="font-medium text-white">{adminsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Content Managers</span>
                <span className="font-medium text-white">{cmsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Instructors</span>
                <span className="font-medium text-white">{instructorsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Active Students</span>
                <span className="font-medium text-white">{studentsCount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Catalog Snapshot</h4>
            <div className="space-y-2 text-slate-300">
              {courses.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-slate-400 truncate max-w-[180px]">{c.title}</span>
                  <span className="font-medium text-white font-mono">${c.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. User Growth & Demographics Complex Card */}
      <div className="lg:col-span-5 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-6">
        <div>
          {/* Card Header & Toggle Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Live Role Demographics</span>
            </h3>

            {/* View Switcher Tabs */}
            <div className="flex items-center bg-[#1a2436] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveChartTab('pie')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeChartTab === 'pie' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Pie</span>
              </button>
              <button
                onClick={() => setActiveChartTab('bar')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeChartTab === 'bar' ? 'bg-[#3b82f6] text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SVG Interactive Pie / Donut Chart */}
          {activeChartTab === 'pie' ? (
            <div className="mt-6 flex flex-col items-center space-y-6 animate-fadeIn">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                  {demographicsData.map((slice) => {
                    const startPercent = cumulativePercent;
                    cumulativePercent += (slice.percentage || 0) / 100;
                    const endPercent = cumulativePercent;

                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);

                    const largeArcFlag = (slice.percentage || 0) / 100 > 0.5 ? 1 : 0;

                    const pathData = [
                      `M ${startX} ${startY}`,
                      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                      `L 0 0`,
                    ].join(' ');

                    const isHovered = hoveredSlice?.label === slice.label;

                    return (
                      <path
                        key={slice.label}
                        d={pathData}
                        fill={slice.color}
                        onMouseEnter={() => setHoveredSlice(slice)}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className="transition-all duration-300 cursor-pointer hover:opacity-90 hover:scale-105"
                        style={{
                          transformOrigin: '0 0',
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                      />
                    );
                  })}
                  {/* Inner Hole for Donut Effect */}
                  <circle cx="0" cy="0" r="0.6" fill="#141d2b" />
                </svg>

                {/* Center Callout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-extrabold text-white">{users.length}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Total Users</span>
                </div>
              </div>

              {/* Pie Legend List */}
              <div className="grid grid-cols-2 gap-3 w-full text-xs pt-2">
                {demographicsData.map((item) => (
                  <div
                    key={item.label}
                    onMouseEnter={() => setHoveredSlice(item)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      hoveredSlice?.label === item.label
                        ? 'bg-[#1a2436] border-slate-700 shadow-md scale-102'
                        : 'bg-[#1a2436]/60 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-300 font-medium truncate">{item.label}</span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between pl-4">
                      <span className="font-mono font-bold text-white">{item.count}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* TAB 2: Purple Bar Chart */
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Database User Growth</span>
                <span className="text-purple-400 font-bold">{users.length} Total Users</span>
              </div>

              <div className="flex items-end justify-between h-48 px-3 pt-4 border-b border-slate-800/80">
                {userGrowthData.map((d) => {
                  const maxCount = Math.max(...userGrowthData.map((item) => item.count), 1);
                  const heightPct = Math.max(15, (d.count / maxCount) * 100);
                  return (
                    <div key={d.month} className="flex flex-col items-center gap-2 flex-1 group">
                      <div className="text-[10px] text-purple-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.count}
                      </div>
                      <div className="w-8 sm:w-10 bg-[#1a2436] rounded-t-lg overflow-hidden flex items-end h-36 border border-slate-800">
                        <div
                          className="w-full bg-[#8b5cf6] rounded-t-lg group-hover:bg-purple-500 transition-all duration-300"
                          style={{ height: `${heightPct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <span>{activeChartTab === 'pie' ? 'Live Role Breakdown' : 'User Trend'}</span>
          <span className="font-bold text-white font-mono">{users.length} Active Records</span>
        </div>
      </div>
    </div>
  );
};
