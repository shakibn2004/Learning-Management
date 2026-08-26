'use client';

import React, { useState } from 'react';
import { PieChart as PieIcon, BarChart3, Users } from 'lucide-react';

export const PlatformAnalyticsCharts: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; value: number } | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<'pie' | 'bar'>('pie');
  const [hoveredSlice, setHoveredSlice] = useState<{ label: string; count: number; percentage: number; color: string } | null>(null);

  // Revenue chart data
  const revenueData = [
    { month: 'Jan', value: 62000 },
    { month: 'Feb', value: 74000 },
    { month: 'Mar', value: 81000 },
    { month: 'Apr', value: 96000 },
    { month: 'May', value: 112000 },
    { month: 'Jun', value: 124580 },
  ];

  // User growth bar chart
  const userGrowthData = [
    { month: 'Jan', count: 1200 },
    { month: 'Feb', count: 1900 },
    { month: 'Mar', count: 1500 },
    { month: 'Apr', count: 2100 },
    { month: 'May', count: 1780 },
    { month: 'Jun', count: 2400 },
  ];

  // Demographics Pie Chart Segments
  const demographicsData = [
    { label: 'Students', count: 5730, percentage: 68, color: '#34d399' },
    { label: 'Instructors', count: 1510, percentage: 18, color: '#60a5fa' },
    { label: 'Content Directors', count: 840, percentage: 10, color: '#fbbf24' },
    { label: 'System Admins', count: 349, percentage: 4, color: '#c084fc' },
  ];

  const svgWidth = 560;
  const svgHeight = 180;
  const paddingLeft = 45;
  const paddingBottom = 25;
  const paddingTop = 15;
  const paddingRight = 15;

  const maxRevenue = 140000;
  const minRevenue = 60000;

  const getX = (index: number) => paddingLeft + (index * (svgWidth - paddingLeft - paddingRight)) / (revenueData.length - 1);
  const getY = (val: number) => svgHeight - paddingBottom - ((val - minRevenue) * (svgHeight - paddingTop - paddingBottom)) / (maxRevenue - minRevenue);

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
          <h3 className="text-lg font-bold text-white tracking-tight">Revenue Analytics</h3>
        </div>

        {/* 4 Mini Stat Boxes Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Total Revenue</span>
            <div className="text-lg font-extrabold text-[#34d399] mt-0.5">$124,580</div>
            <span className="text-[10px] text-[#34d399] font-medium">+12.5% from last month</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Monthly Growth</span>
            <div className="text-lg font-extrabold text-[#60a5fa] mt-0.5">8.3%</div>
            <span className="text-[10px] text-[#60a5fa] font-medium">+2.1% from last month</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Average Order</span>
            <div className="text-lg font-extrabold text-[#f97316] mt-0.5">$89.50</div>
            <span className="text-[10px] text-[#f87171] font-medium">-3.2% from last month</span>
          </div>

          <div className="bg-[#1a2436] p-3.5 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium">Conversion Rate</span>
            <div className="text-lg font-extrabold text-[#c084fc] mt-0.5">3.7%</div>
            <span className="text-[10px] text-[#34d399] font-medium">+0.8% from last month</span>
          </div>
        </div>

        {/* Line Chart Header Legend */}
        <div className="flex items-center justify-end space-x-2 text-xs">
          <span className="w-3 h-3 bg-[#3b82f6] rounded-sm inline-block"></span>
          <span className="text-slate-400 font-medium">Revenue</span>
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

            {[140000, 120000, 100000, 80000, 60000].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#1e293b" strokeWidth="0.8" />
                  <text x={paddingLeft - 8} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">
                    {val.toLocaleString()}
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
              <div className="font-bold text-white">{hoveredPoint.month} Revenue</div>
              <div className="text-blue-400 font-mono font-bold">${hoveredPoint.value.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Bottom Breakdown Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Revenue by Source</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Direct Sales</span>
                <span className="font-medium text-white">$52,340 <span className="text-slate-500 font-normal">(42%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Online Store</span>
                <span className="font-medium text-white">$38,920 <span className="text-slate-500 font-normal">(31%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Partnerships</span>
                <span className="font-medium text-white">$21,180 <span className="text-slate-500 font-normal">(17%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Subscriptions</span>
                <span className="font-medium text-white">$12,140 <span className="text-slate-500 font-normal">(10%)</span></span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Top Performing Products</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Premium Package</span>
                <span className="font-medium text-white">$18,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Standard Plan</span>
                <span className="font-medium text-white">$15,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Add-on Services</span>
                <span className="font-medium text-white">$12,890</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Basic Plan</span>
                <span className="font-medium text-white">$9,670</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. User Growth & Demographics Complex Card (Pie Chart + Bar Chart) */}
      <div className="lg:col-span-5 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-6">
        <div>
          {/* Card Header & Toggle Switch */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>User Demographics & Growth</span>
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
                    cumulativePercent += slice.percentage / 100;
                    const endPercent = cumulativePercent;

                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);

                    const largeArcFlag = slice.percentage / 100 > 0.5 ? 1 : 0;

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
                  <span className="text-xl font-extrabold text-white">8,429</span>
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
                      <span className="font-mono font-bold text-white">{item.count.toLocaleString()}</span>
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
                <span>Monthly Registration Trend</span>
                <span className="text-purple-400 font-bold">+24% Growth</span>
              </div>

              <div className="flex items-end justify-between h-48 px-3 pt-4 border-b border-slate-800/80">
                {userGrowthData.map((d) => {
                  const heightPct = (d.count / 2500) * 100;
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
          <span>{activeChartTab === 'pie' ? 'Role Distribution Breakdown' : 'Monthly Registrations'}</span>
          <span className="font-bold text-white font-mono">8,429 Active</span>
        </div>
      </div>
    </div>
  );
};
