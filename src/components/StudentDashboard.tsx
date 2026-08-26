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
  Sparkles,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';

interface StudentDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { courses, currentUser, enrollInCourse, getCourseProgress, activeRole } = useLMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [activeCourseForLessons, setActiveCourseForLessons] = useState<Course | null>(null);
  const [activeCourseForQuiz, setActiveCourseForQuiz] = useState<Course | null>(null);

  // Published courses available
  const availableCourses = courses.filter((c) => c.published);

  // Enrolled courses for current user
  const enrolledCourses = availableCourses.filter((c) =>
    currentUser.enrolledCourseIds?.includes(c.id)
  );

  // Filtered available courses
  const filteredCourses = availableCourses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Student Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'my-courses' ? 'My Enrolled Courses & Progress' : 'Course Catalog & Discovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {activeTab === 'my-courses'
              ? 'Continue your sequential learning journey, track completion percentages in real time, and pass auto-graded quizzes.'
              : 'Browse top-rated full-stack courses, inspect curricula, and enroll with a single click.'}
          </p>
        </div>

        {activeTab === 'my-courses' ? (
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shrink-0"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Discover More Courses</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('my-courses')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>My Courses ({enrolledCourses.length})</span>
          </button>
        )}
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
                    className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
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
                        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActiveCourseForLessons(course)}
                        className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center space-x-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Continue Lessons</span>
                      </button>

                      {course.quiz && (
                        <button
                          onClick={() => setActiveCourseForQuiz(course)}
                          className="py-2.5 px-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-1"
                        >
                          <Award className="w-4 h-4 text-purple-400" />
                          <span>Quiz</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
              <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You are currently not enrolled in any courses. Explore the catalog and click "Enroll in Course" to get started!
              </p>
              <button
                onClick={() => setActiveTab('courses')}
                className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search courses, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full text-xs pl-9 pr-3 py-2.5 rounded-xl"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'Web Development', 'Design & UI/UX', 'DevOps & Cloud'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 hover:text-white'
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
                  className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                          {course.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600/80 backdrop-blur-md text-white">
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
                        className="w-full py-2.5 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2"
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
