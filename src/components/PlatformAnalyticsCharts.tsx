'use client';

import React, { useState } from 'react';
import { TrendingUp, BarChart3, Calendar, Layers } from 'lucide-react';

export const PlatformAnalyticsCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'This Year' | 'This Month' | 'This Week'>('This Year');
  const [activeMetric, setActiveMetric] = useState<'all' | 'enrollments' | 'lessons' | 'quizzes'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ month: string; enrollments: number; lessons: number; quizzes: number } | null>(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Data sets matching the reference image trends
  const trendData = [
    { month: 'Jan', enrollments: 320, lessons: 1200, quizzes: 240 },
    { month: 'Feb', enrollments: 450, lessons: 1850, quizzes: 380 },
    { month: 'Mar', enrollments: 680, lessons: 2400, quizzes: 510 },
    { month: 'Apr', enrollments: 590, lessons: 2100, quizzes: 490 },
    { month: 'May', enrollments: 820, lessons: 3100, quizzes: 720 },
    { month: 'Jun', enrollments: 950, lessons: 3900, quizzes: 880 },
    { month: 'Jul', enrollments: 1100, lessons: 4200, quizzes: 990 },
    { month: 'Aug', enrollments: 1245, lessons: 4800, quizzes: 1150 },
    { month: 'Sep', enrollments: 1180, lessons: 4500, quizzes: 1080 },
    { month: 'Oct', enrollments: 1350, lessons: 5200, quizzes: 1290 },
    { month: 'Nov', enrollments: 1480, lessons: 5800, quizzes: 1410 },
    { month: 'Dec', enrollments: 1620, lessons: 6400, quizzes: 1560 },
  ];

  // User growth bar data
  const userGrowthData = [
    { month: 'Jan', count: 1200 },
    { month: 'Feb', count: 1900 },
    { month: 'Mar', count: 1500 },
    { month: 'Apr', count: 2100 },
    { month: 'May', count: 1750 },
    { month: 'Jun', count: 2400 },
  ];

  // SVG dimensions
  const svgWidth = 650;
  const svgHeight = 220;
  const padding = 35;

  const maxVal = 7000;
  const getX = (index: number) => padding + (index * (svgWidth - 2 * padding)) / (trendData.length - 1);
  const getY = (val: number) => svgHeight - padding - (val * (svgHeight - 2 * padding)) / maxVal;

  // Bezier curve generator
  const createBezierPath = (key: 'enrollments' | 'lessons' | 'quizzes', scaleMultiplier: number) => {
    return trendData.reduce((acc, point, i) => {
      const x = getX(i);
      const y = getY(point[key] * scaleMultiplier);
      if (i === 0) return `M ${x} ${y}`;
      const prevX = getX(i - 1);
      const prevY = getY(trendData[i - 1][key] * scaleMultiplier);
      const cp1x = prevX + (x - prevX) / 2;
      const cp2x = prevX + (x - prevX) / 2;
      return `${acc} C ${cp1x} ${prevY}, ${cp2x} ${y}, ${x} ${y}`;
    }, '');
  };

  const pathLessons = createBezierPath('lessons', 1);
  const pathEnrollments = createBezierPath('enrollments', 3.5);
  const pathQuizzes = createBezierPath('quizzes', 3.5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Multi-Curve Activity Trends Chart (Matches Image 2) */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Platform Activity & Engagement Trends</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Real-time student submissions, lesson completions, and course enrollments.</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="glass-input text-xs px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200 border-slate-700"
            >
              <option value="This Year">This year</option>
              <option value="This Month">This month</option>
              <option value="This Week">This week</option>
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button
            onClick={() => setActiveMetric(activeMetric === 'lessons' ? 'all' : 'lessons')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${
              activeMetric === 'all' || activeMetric === 'lessons'
                ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
                : 'opacity-40 border-transparent'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Lessons Completed</span>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === 'enrollments' ? 'all' : 'enrollments')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${
              activeMetric === 'all' || activeMetric === 'enrollments'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'opacity-40 border-transparent'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Course Enrollments</span>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === 'quizzes' ? 'all' : 'quizzes')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${
              activeMetric === 'all' || activeMetric === 'quizzes'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'opacity-40 border-transparent'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Quiz Attempts</span>
          </button>
        </div>

        {/* SVG Interactive Chart */}
        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding + ratio * (svgHeight - 2 * padding);
              return (
                <g key={idx}>
                  <line x1={padding} y1={y} x2={svgWidth - padding} y2={y} stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />
                  <text x={padding - 10} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">
                    {Math.round((1 - ratio) * 100)}%
                  </text>
                </g>
              );
            })}

            {/* Curves */}
            {(activeMetric === 'all' || activeMetric === 'lessons') && (
              <path d={pathLessons} fill="none" stroke="#a855f7" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            )}

            {(activeMetric === 'all' || activeMetric === 'enrollments') && (
              <path d={pathEnrollments} fill="none" stroke="#10b981" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            )}

            {(activeMetric === 'all' || activeMetric === 'quizzes') && (
              <path d={pathQuizzes} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" className="drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            )}

            {/* Data point circles & hover triggers */}
            {trendData.map((d, i) => {
              const cx = getX(i);
              const cyLessons = getY(d.lessons);
              const cyEnroll = getY(d.enrollments * 3.5);

              return (
                <g
                  key={d.month}
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                >
                  <circle cx={cx} cy={cyLessons} r="4" fill="#a855f7" stroke="#0f172a" strokeWidth="2" />
                  <circle cx={cx} cy={cyEnroll} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                  <text x={cx} y={svgHeight - 10} fill="#64748b" fontSize="9" textAnchor="middle">
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Popup */}
          {hoveredPoint && (
            <div className="absolute top-2 right-4 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-md animate-fadeIn">
              <div className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{hoveredPoint.month} Metrics</div>
              <div className="text-purple-400 font-mono">Lessons Completed: <strong>{hoveredPoint.lessons}</strong></div>
              <div className="text-emerald-400 font-mono">Enrollments: <strong>{hoveredPoint.enrollments}</strong></div>
              <div className="text-amber-400 font-mono">Quizzes Taken: <strong>{hoveredPoint.quizzes}</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* 2. User Growth Bar Chart (Matches Image 1) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Monthly User Growth</h3>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">+24% vs last period</span>
          </div>

          <div className="mt-4 flex items-end justify-between h-48 px-2 pt-4">
            {userGrowthData.map((d) => {
              const heightPct = (d.count / 2500) * 100;
              return (
                <div key={d.month} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="text-[10px] text-purple-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}
                  </div>
                  <div className="w-8 sm:w-10 bg-slate-900 rounded-t-xl overflow-hidden relative flex items-end h-36 border border-slate-800">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 via-purple-600 to-pink-500 rounded-t-xl group-hover:brightness-125 transition-all duration-300 shadow-lg shadow-purple-500/20"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Active Monthly Registrations</span>
          <span className="font-bold text-white font-mono">11,850 Total</span>
        </div>
      </div>
    </div>
  );
};
