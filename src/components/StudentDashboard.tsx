'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course } from '../types';
import { LessonViewer } from './LessonViewer';
import { QuizModal } from './QuizModal';
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  Award,
  Search,
  CheckCircle2,
  Zap,
  Video,
  Star,
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { courses, progress, quizAttempts, currentUser, enrollInCourse, getCourseProgress, activeRole } = useLMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [activeCourseForLessons, setActiveCourseForLessons] = useState<Course | null>(null);
  const [activeCourseForQuiz, setActiveCourseForQuiz] = useState<Course | null>(null);

  const availableCourses = courses.filter((c) => c.published);

  const enrolledCourses = availableCourses.filter((c) =>
    currentUser.enrolledCourseIds?.includes(c.id)
  );

  const studentProgress = progress.filter((p) => p.userId === currentUser.id);
  const totalCompletedLessons = studentProgress.reduce(
    (sum, p) => sum + (p.completedLessonIds?.length || 0),
    0
  );

  const studentAttempts = quizAttempts.filter((qa) => qa.studentId === currentUser.id);
  const passedQuizzesCount = studentAttempts.filter((qa) => qa.passed).length;
  const avgQuizScore =
    studentAttempts.length > 0
      ? Math.round(
          studentAttempts.reduce((sum, qa) => sum + (qa.scorePercentage || 0), 0) /
            studentAttempts.length
        )
      : 0;

  const filteredCourses = availableCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Title Bar matching 1st reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {activeTab === 'my-courses' ? 'Student Learning Command Center' : 'Course Catalog Discovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTab === 'my-courses'
              ? `Welcome back, ${currentUser.name}! Continue your interactive learning journey.`
              : 'Browse top-rated full-stack courses, inspect curricula, and enroll instantly.'}
          </p>
        </div>

        {activeTab === 'my-courses' ? (
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Discover Courses</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-courses')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Courses ({enrolledCourses.length})</span>
          </button>
        )}
      </div>

      {/* TOP 4 STAT CARDS GRID (Unified with Admin) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Enrolled Courses</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{enrolledCourses.length}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">Active learning paths</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Lessons Completed</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{totalCompletedLessons}</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">Live DB progress</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Quizzes Passed</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{passedQuizzesCount}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">
              {studentAttempts.length} total attempts
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Avg Quiz Score</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">
              {avgQuizScore > 0 ? `${avgQuizScore}%` : 'N/A'}
            </div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">Calculated from assessments</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* VIEW 1: MY ENROLLED COURSES */}
      {activeTab === 'my-courses' && (
        <div className="space-y-6">
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => {
                const progressPct = getCourseProgress(currentUser.id, course.id);

                return (
                  <div
                    key={course.id}
                    className="bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {course.category}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {course.lessons?.length || 0} Lessons
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{course.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Course Completion</span>
                          <span className="font-bold text-white">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-[#1a2436] h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-[#3b82f6] h-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActiveCourseForLessons(course)}
                        className="flex-1 py-2.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Lessons</span>
                      </button>

                      {course.quiz && (
                        <button
                          onClick={() => setActiveCourseForQuiz(course)}
                          className="py-2.5 px-4 bg-[#a855f7]/15 hover:bg-[#a855f7]/25 text-[#c084fc] border border-[#a855f7]/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <Award className="w-4 h-4 text-[#c084fc]" />
                          <span>Quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#141d2b] rounded-2xl border border-slate-800/80 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You are currently not enrolled in any courses. Explore the catalog and click "Enroll Now" to get started!
              </p>
              <button
                onClick={() => setActiveTab('courses')}
                className="mt-4 px-5 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20"
              >
                Browse Course Catalog
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: COURSE CATALOG DISCOVERY */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141d2b] p-4 rounded-2xl border border-slate-800/80">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a2436] w-full text-xs pl-9 pr-3 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'Web Development', 'Design & UI/UX', 'DevOps & Cloud'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'bg-[#1a2436] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = currentUser.enrolledCourseIds?.includes(course.id);

              return (
                <div
                  key={course.id}
                  className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                          {course.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3b82f6] text-white">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-white line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                      <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                        <span>Instructor: <strong className="text-slate-200">{course.instructorName}</strong></span>
                        <span>{course.lessons?.length || 0} Lessons</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {isEnrolled ? (
                      <button
                        onClick={() => {
                          setActiveTab('my-courses');
                          setActiveCourseForLessons(course);
                        }}
                        className="w-full py-2.5 px-4 bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#34d399] border border-[#10b981]/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                        <span>Enrolled • Launch Lessons</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (activeRole === 'Student') {
                            enrollInCourse(course.id);
                          } else {
                            alert('Switch to the Student role using the top header to enroll as a student.');
                          }
                        }}
                        className="w-full py-2.5 px-4 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Enroll Now (${course.price})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lesson Player Modal */}
      {activeCourseForLessons && (
        <LessonViewer
          course={activeCourseForLessons}
          onClose={() => setActiveCourseForLessons(null)}
          onOpenQuiz={() => {
            const c = activeCourseForLessons;
            setActiveCourseForLessons(null);
            setActiveCourseForQuiz(c);
          }}
        />
      )}

      {/* Quiz Modal */}
      {activeCourseForQuiz && activeCourseForQuiz.quiz && (
        <QuizModal
          quiz={activeCourseForQuiz.quiz}
          onClose={() => setActiveCourseForQuiz(null)}
        />
      )}
    </div>
  );
};
