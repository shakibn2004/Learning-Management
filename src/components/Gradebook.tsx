'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import {
  Award,
  GraduationCap,
  ShieldAlert,
  Search,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Filter,
} from 'lucide-react';

export const Gradebook: React.FC = () => {
  const { users, courses, progress, quizAttempts, currentUser, activeRole, getCourseProgress } = useLMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  if (activeRole === 'Student') {
    return (
      <div className="p-8 sm:p-12 text-center bg-[#141d2b] rounded-2xl border border-rose-500/30">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-bold text-white mb-1">Role Restriction</h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Students can track their own progress directly inside the <strong className="text-[#60a5fa]">My Enrolled Courses</strong> dashboard. The multi-student Gradebook is for Instructors, Content Managers, and Admins.
        </p>
      </div>
    );
  }

  const students = users.filter((u) => u.role === 'Student');

  const accessibleCourses = courses.filter((c) => {
    if (activeRole === 'Admin' || activeRole === 'Content Manager') return true;
    if (activeRole === 'Instructor') return c.instructorId === currentUser.id;
    return true;
  });

  const filteredCourses = accessibleCourses.filter((c) => {
    return courseFilter === 'ALL' || c.id === courseFilter;
  });

  // Calculate live gradebook metrics
  const totalEnrolledRecords = accessibleCourses.reduce((sum, course) => {
    return sum + students.filter((s) => s.enrolledCourseIds?.includes(course.id)).length;
  }, 0);

  const totalPassedAttempts = quizAttempts.filter((qa) => qa.passed).length;
  
  // Calculate average completion rate across all student course pairs
  let totalProgSum = 0;
  let totalPairs = 0;
  let completedCertificates = 0;

  accessibleCourses.forEach((c) => {
    const enrolled = students.filter((s) => s.enrolledCourseIds?.includes(c.id));
    enrolled.forEach((s) => {
      const pct = getCourseProgress(s.id, c.id);
      totalProgSum += pct;
      totalPairs++;
      if (pct === 100) completedCertificates++;
    });
  });

  const avgCompletionRate = totalPairs > 0 ? Math.round(totalProgSum / totalPairs) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Student Progress & Gradebook Roster</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time lesson completion percentages, quiz score performance, and milestone tracking across all enrolled students in Strapi.
          </p>
        </div>
      </div>

      {/* 1. TOP 4 STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Enrollments</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{totalEnrolledRecords}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">Across managed courses</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Avg Completion Rate</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{avgCompletionRate}%</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">Class progress mean</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Passed Quizzes</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{totalPassedAttempts}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">
              {quizAttempts.length} total assessments
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">100% Completed</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">{completedCertificates}</div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">Graduation eligible</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & COURSE FILTER BAR */}
      <div className="bg-[#141d2b] p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a2436] text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="bg-[#1a2436] text-xs px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="ALL">All Managed Courses ({accessibleCourses.length})</option>
            {accessibleCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. GRADEBOOK CARDS & TABLES */}
      <div className="space-y-6">
        {filteredCourses.map((course) => {
          const enrolledStudents = students
            .filter((s) => s.enrolledCourseIds?.includes(course.id))
            .filter((s) => {
              return (
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase())
              );
            });

          return (
            <div key={course.id} className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#141d2b] to-[#1a2436]/40">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa] shrink-0 font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{course.title}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Instructor: <strong className="text-slate-300">{course.instructorName}</strong> • {course.lessons?.length || 0} Total Modules • {course.quiz ? '1 Quiz Assessment' : 'No Quiz'}
                    </div>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-semibold rounded-xl self-start sm:self-auto">
                  {enrolledStudents.length} Students Enrolled
                </span>
              </div>

              {enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 min-w-[650px]">
                    <thead className="bg-[#1a2436] text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-3.5">Student Information</th>
                        <th className="px-6 py-3.5">Lesson Checklist</th>
                        <th className="px-6 py-3.5">Live Progress %</th>
                        <th className="px-6 py-3.5">Quiz Assessment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {enrolledStudents.map((student) => {
                        const progPct = getCourseProgress(student.id, course.id);
                        const userProg = progress.find(
                          (p) => p.userId === student.id && p.courseId === course.id
                        );
                        const completedCount = userProg?.completedLessonIds.length || 0;
                        const totalLessons = course.lessons?.length || 1;

                        const quizId = course.quiz?.id;
                        const attempt = quizAttempts.find(
                          (qa) => qa.studentId === student.id && qa.quizId === quizId
                        );

                        return (
                          <tr key={student.id} className="hover:bg-[#1a2436]/50 transition-colors">
                            <td className="px-6 py-4 flex items-center space-x-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-semibold text-white">{student.name}</div>
                                <div className="text-slate-400 text-[11px]">{student.email}</div>
                              </div>
                            </td>

                            <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                              <span className="text-[#60a5fa]">{completedCount}</span> / {totalLessons} Modules
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-28 sm:w-36 bg-[#1a2436] h-2.5 rounded-full overflow-hidden border border-slate-800">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      progPct === 100
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                        : progPct > 50
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-400'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-400'
                                    }`}
                                    style={{ width: `${progPct}%` }}
                                  ></div>
                                </div>
                                <span className={`font-mono font-bold ${
                                  progPct === 100 ? 'text-[#34d399]' : progPct > 50 ? 'text-[#60a5fa]' : 'text-slate-300'
                                }`}>
                                  {progPct}%
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {attempt ? (
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border shadow-sm ${
                                    attempt.passed
                                      ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30'
                                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                  }`}
                                >
                                  {attempt.passed ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                                      <span>PASSED ({attempt.scorePercentage}%)</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                                      <span>FAILED ({attempt.scorePercentage}%)</span>
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span className="text-slate-500 italic text-[11px]">
                                  No Attempt Recorded
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  No enrolled students match your search filter for this course.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
