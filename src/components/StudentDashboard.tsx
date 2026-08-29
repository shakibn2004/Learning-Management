'use client';

import React, { useState, useEffect } from 'react';
import { useLMS } from '../context/LMSContext';
import { useToast } from '../context/ToastContext';
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
  RotateCw,
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab: propActiveTab = 'my-courses', setActiveTab }) => {
  const toast = useToast();
  const { courses, progress, quizAttempts, currentUser, enrollInCourse, getCourseProgress, activeRole, refreshData } = useLMS();

  const [localTab, setLocalTab] = useState(propActiveTab);
  const activeTab = localTab || propActiveTab;

  const switchTab = (tab: string) => {
    setLocalTab(tab);
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeCourseForLessons, setActiveCourseForLessons] = useState<Course | null>(null);
  const [activeCourseForQuiz, setActiveCourseForQuiz] = useState<Course | null>(null);

  // Live real-time fetch from database on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      toast.success('Database Synced', 'Fresh course catalog and enrollment records loaded from database.');
    } catch (e: any) {
      toast.error('Sync Failed', e.message || 'Could not fetch from database.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const isCourseEnrolled = (course: Course) => {
    if (!currentUser?.enrolledCourseIds || !Array.isArray(currentUser.enrolledCourseIds)) return false;
    return currentUser.enrolledCourseIds.some((eId: any) => {
      const sEId = String(eId);
      const sCId = String(course.id);
      const sDocId = String((course as any).documentId || '');
      return sEId === sCId || (sDocId && sEId === sDocId);
    });
  };

  const availableCourses = courses.filter((c) => c && c.published !== false);

  const enrolledCourses = availableCourses.filter((c) => isCourseEnrolled(c));

  const studentProgress = progress.filter(
    (p) => String(p.userId) === String(currentUser.id) || p.userId === currentUser.email
  );
  const totalCompletedLessons = studentProgress.reduce(
    (sum, p) => sum + (p.completedLessonIds?.length || 0),
    0
  );

  const studentAttempts = quizAttempts.filter(
    (qa) => String(qa.studentId) === String(currentUser.id)
  );
  // Group by quizId to evaluate the latest attempt per quiz
  const latestAttemptsByQuiz = Object.values(
    studentAttempts.reduce((acc: Record<string, (typeof studentAttempts)[0]>, curr) => {
      if (!acc[curr.quizId] || new Date(curr.completedAt) > new Date(acc[curr.quizId].completedAt)) {
        acc[curr.quizId] = curr;
      }
      return acc;
    }, {})
  );
  const passedQuizzesCount = latestAttemptsByQuiz.filter((qa) => qa.passed).length;
  const avgQuizScore =
    latestAttemptsByQuiz.length > 0
      ? Math.round(
          latestAttemptsByQuiz.reduce((sum, qa) => sum + (qa.scorePercentage || 0), 0) /
            latestAttemptsByQuiz.length
        )
      : 0;

  const filteredCourses = availableCourses.filter((c) => {
    const matchesSearch =
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Title Bar & View Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {activeTab === 'my-courses' ? 'Student Learning Command Center' : 'Course Catalog Discovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTab === 'my-courses'
              ? `Welcome back, ${currentUser.name || 'Learner'}! Continue your interactive learning journey.`
              : 'Browse top-rated full-stack courses, inspect curricula, and enroll instantly.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#141d2b] p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => switchTab('my-courses')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my-courses'
                ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2436]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Courses ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => switchTab('courses')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2436]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Catalog ({availableCourses.length})</span>
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Sync Live Database Records"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a2436] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
        </div>
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
                const courseProg = progress.find(
                  (p) =>
                    (String(p.userId) === String(currentUser.id) || p.userId === currentUser.email) &&
                    (String(p.courseId) === String(course.id) || (course as any).documentId === p.courseId)
                );
                const totalLessons = course.lessons?.length || 0;
                const completedLessonsCount = (course.lessons || []).filter((l) =>
                  courseProg?.completedLessonIds?.includes(l.id)
                ).length;

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
                          {totalLessons} Lessons
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{course.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>

                      {/* Progress Bar & Exact Ratio */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Progress</span>
                          <span className="font-bold text-[#60a5fa]">
                            {totalLessons > 0 ? `${completedLessonsCount} of ${totalLessons} lessons done (${progressPct}%)` : '0 lessons'}
                          </span>
                        </div>
                        <div className="w-full bg-[#1a2436] h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              progressPct === 100 ? 'bg-[#10b981]' : 'bg-[#3b82f6]'
                            }`}
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
                onClick={() => switchTab('courses')}
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
              const isEnrolled = isCourseEnrolled(course);

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
                          switchTab('my-courses');
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
                          if (currentUser?.role === 'Student' || activeRole === 'Student') {
                            enrollInCourse(course.id);
                          } else {
                            toast.info('Student Role Required', 'Log in as a Student to enroll in courses.');
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
