'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { Award, GraduationCap, CheckCircle2, BarChart2, ShieldAlert, Sparkles } from 'lucide-react';

export const Gradebook: React.FC = () => {
  const { users, courses, progress, quizAttempts, currentUser, activeRole, getCourseProgress } = useLMS();

  if (activeRole === 'Student') {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border border-rose-500/30">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Role Restriction</h2>
        <p className="text-sm text-slate-400">
          Students can track their own progress directly inside the <strong className="text-indigo-400">My Enrolled Courses</strong> dashboard. The multi-student Gradebook is for Instructors, Content Managers, and Admins.
        </p>
      </div>
    );
  }

  // Filter students
  const students = users.filter((u) => u.role === 'Student');

  // Filter courses instructor owns if role === 'Instructor'
  const accessibleCourses = courses.filter((c) => {
    if (activeRole === 'Admin' || activeRole === 'Content Manager') return true;
    if (activeRole === 'Instructor') return c.instructorId === currentUser.id;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Performance Oversight</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Student Progress & Gradebook Roster</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time lesson completion percentages, quiz score performance, and persistent milestone tracking across enrolled students.
          </p>
        </div>
      </div>

      {/* Gradebook Grid / Table */}
      <div className="space-y-6">
        {accessibleCourses.map((course) => {
          // Find students enrolled in this course
          const enrolledStudents = students.filter((s) => s.enrolledCourseIds?.includes(course.id));

          return (
            <div key={course.id} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{course.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Instructor: {course.instructorName} • {course.lessons?.length || 0} Total Lessons
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full">
                  {enrolledStudents.length} Enrolled Students
                </span>
              </div>

              {enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3">Student Name</th>
                        <th className="px-5 py-3">Completed Lessons</th>
                        <th className="px-5 py-3">Course Completion %</th>
                        <th className="px-5 py-3">Quiz Results</th>
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

                        // Find quiz attempt for this course
                        const quizId = course.quiz?.id;
                        const attempt = quizAttempts.find(
                          (qa) => qa.studentId === student.id && qa.quizId === quizId
                        );

                        return (
                          <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="px-5 py-4 flex items-center space-x-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-700"
                              />
                              <div>
                                <div className="font-semibold text-white">{student.name}</div>
                                <div className="text-slate-400 text-[11px]">{student.email}</div>
                              </div>
                            </td>

                            <td className="px-5 py-4 font-mono font-medium text-slate-200">
                              {completedCount} / {totalLessons} Lessons
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      progPct === 100
                                        ? 'bg-emerald-400'
                                        : progPct > 50
                                        ? 'bg-indigo-500'
                                        : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${progPct}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold text-white">{progPct}%</span>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              {attempt ? (
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                    attempt.passed
                                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                  }`}
                                >
                                  {attempt.passed ? 'PASSED' : 'FAILED'} ({attempt.scorePercentage}%)
                                </span>
                              ) : (
                                <span className="text-slate-500 italic">No Quiz Attempted</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active student enrollments for this course yet.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
