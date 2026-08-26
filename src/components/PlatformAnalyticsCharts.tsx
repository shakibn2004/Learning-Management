'use client';

import React, { useState } from 'react';

export const PlatformAnalyticsCharts: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; value: number } | null>(null);

  // Revenue chart data matching 1st reference image
  const revenueData = [
    { month: 'Jan', value: 62000 },
    { month: 'Feb', value: 74000 },
    { month: 'Mar', value: 81000 },
    { month: 'Apr', value: 96000 },
    { month: 'May', value: 112000 },
    { month: 'Jun', value: 124580 },
  ];

  // User growth bar chart matching 1st reference image
  const userGrowthData = [
    { month: 'Jan', count: 1200 },
    { month: 'Feb', count: 1900 },
    { month: 'Mar', count: 1500 },
    { month: 'Apr', count: 2100 },
    { month: 'May', count: 1780 },
    { month: 'Jun', count: 2400 },
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

  // Fill area under curve
  const fillPath = `${revenuePath} L ${getX(revenueData.length - 1)} ${svgHeight - paddingBottom} L ${getX(0)} ${svgHeight - paddingBottom} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Revenue Analytics Card (matching 1st reference image) */}
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

            {/* Grid lines & Y-axis Labels */}
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

            {/* Gradient Fill */}
            <path d={fillPath} fill="url(#revenueGrad)" />

            {/* Blue Curve */}
            <path d={revenuePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

            {/* Data Points */}
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

        {/* Bottom Breakdown Section (2 columns matching 1st reference image) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 text-xs">
          {/* Revenue by Source */}
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

          {/* Top Performing Courses */}
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

      {/* 2. User Growth Card (matching 1st reference image) */}
      <div className="lg:col-span-5 bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">User Growth</h3>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-3 h-3 bg-[#a855f7] rounded-sm inline-block"></span>
              <span className="text-slate-400 font-medium">New Users</span>
            </div>
          </div>

          {/* Purple Vertical Bar Chart */}
          <div className="mt-8 flex items-end justify-between h-56 px-4 pt-4 border-b border-slate-800/80">
            {userGrowthData.map((d) => {
              const heightPct = (d.count / 2500) * 100;
              return (
                <div key={d.month} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="w-10 sm:w-12 bg-[#8b5cf6] rounded-t-lg transition-all duration-300 group-hover:brightness-125" style={{ height: `${heightPct}%` }}></div>
                  <span className="text-xs text-slate-400 font-medium">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>Active User Metrics</span>
          <span className="font-bold text-white font-mono">2,500 Max</span>
        </div>
      </div>
    </div>
  );
};
