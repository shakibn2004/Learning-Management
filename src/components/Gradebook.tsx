'use client';

import React from 'react';
import { useLMS } from '../context/LMSContext';
import { Award, GraduationCap, ShieldAlert } from 'lucide-react';

export const Gradebook: React.FC = () => {
  const { users, courses, progress, quizAttempts, currentUser, activeRole, getCourseProgress } = useLMS();

  if (activeRole === 'Student') {
    return (
      <div className="p-6 sm:p-8 text-center bg-[#141d2b] rounded-2xl border border-rose-500/30">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-1">Role Restriction</h2>
        <p className="text-sm text-slate-400">
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

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Student Progress & Gradebook Roster</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time lesson completion percentages, quiz score performance, and persistent milestone tracking across enrolled students.
          </p>
        </div>
      </div>

      {/* Gradebook Grid / Table */}
      <div className="space-y-6">
        {accessibleCourses.map((course) => {
          const enrolledStudents = students.filter((s) => s.enrolledCourseIds?.includes(course.id));

          return (
            <div key={course.id} className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white">{course.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Instructor: {course.instructorName} • {course.lessons?.length || 0} Total Lessons
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-semibold rounded-md self-start sm:self-auto">
                  {enrolledStudents.length} Enrolled Students
                </span>
              </div>

              {enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 min-w-[600px]">
                    <thead className="bg-[#1a2436] text-slate-400 uppercase font-mono border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3.5">Student Name</th>
                        <th className="px-5 py-3.5">Completed Lessons</th>
                        <th className="px-5 py-3.5">Course Completion %</th>
                        <th className="px-5 py-3.5">Quiz Results</th>
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
                            <td className="px-5 py-3.5 flex items-center space-x-3">
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                              />
                              <div>
                                <div className="font-semibold text-white">{student.name}</div>
                                <div className="text-slate-400 text-[11px]">{student.email}</div>
                              </div>
                            </td>

                            <td className="px-5 py-3.5 font-mono font-medium text-slate-200">
                              {completedCount} / {totalLessons} Lessons
                            </td>

                            <td className="px-5 py-3.5">
                              <div className="flex items-center space-x-3">
                                <div className="w-24 sm:w-32 bg-[#1a2436] h-2 rounded-full overflow-hidden border border-slate-800">
                                  <div
                                    className={`h-full transition-all duration-500 ${
                                      progPct === 100
                                        ? 'bg-[#10b981]'
                                        : progPct > 50
                                        ? 'bg-[#3b82f6]'
                                        : 'bg-[#f59e0b]'
                                    }`}
                                    style={{ width: `${progPct}%` }}
                                  ></div>
                                </div>
                                <span className="font-bold text-white">{progPct}%</span>
                              </div>
                            </td>

                            <td className="px-5 py-3.5">
                              {attempt ? (
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                    attempt.passed
                                      ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30'
                                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
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
