'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course, Lesson } from '../types';
import { CourseModal } from './CourseModal';
import { LessonModal } from './LessonModal';
import { QuizBuilderModal } from './QuizBuilderModal';
import {
  Plus,
  BookOpen,
  Edit3,
  Trash2,
  HelpCircle,
  Video,
  FileText,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

export const ContentManagerDashboard: React.FC = () => {
  const { courses, currentUser, deleteCourse, deleteLesson, activeRole, canPerformAction } = useLMS();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [activeCourseIdForLesson, setActiveCourseIdForLesson] = useState<string | null>(null);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);

  const [activeCourseIdForQuiz, setActiveCourseIdForQuiz] = useState<string | null>(null);

  const displayCourses = courses.filter((course) => {
    if (activeRole === 'Admin' || activeRole === 'Content Manager') return true;
    if (activeRole === 'Instructor') return course.instructorId === currentUser.id;
    return true;
  });

  const totalLessons = displayCourses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const totalQuizzes = displayCourses.filter((c) => !!c.quiz).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Title Bar matching 1st reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {activeRole === 'Instructor' ? 'My Courses Overview' : 'Curriculum & Content Overview'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeRole === 'Instructor'
              ? `Welcome back, ${currentUser.name}. Manage your authored courses and student rosters.`
              : 'Platform-wide course authoring, video lessons, and auto-graded quiz assessments.'}
          </p>
        </div>

        {canPerformAction('create_course') && (
          <button
            onClick={() => {
              setCourseToEdit(null);
              setShowCourseModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Course</span>
          </button>
        )}
      </div>

      {/* TOP 4 STAT CARDS GRID (matching Admin & 1st reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Courses</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{displayCourses.length}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">+8 new this month</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Video Modules</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{totalLessons}</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">Interactive lessons</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Active Quizzes</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{totalQuizzes}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">Auto-graded assessments</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Draft Articles</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">12</div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">Editorial review</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {displayCourses.map((course) => {
          const isOwnerOrFullCM =
            activeRole === 'Admin' ||
            activeRole === 'Content Manager' ||
            (activeRole === 'Instructor' && course.instructorId === currentUser.id);

          return (
            <div key={course.id} className="bg-[#141d2b] p-6 rounded-2xl border border-slate-800/80 space-y-6">
              {/* Course Top Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {course.level}
                      </span>
                      {course.published ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30">
                          Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.subtitle}</p>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Instructor: <strong className="text-slate-200">{course.instructorName}</strong></span>
                      <span>Price: <strong className="text-[#34d399]">${course.price}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isOwnerOrFullCM && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        setCourseToEdit(course);
                        setShowCourseModal(true);
                      }}
                      className="p-2 rounded-xl bg-[#1a2436] hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1 border border-slate-800"
                    >
                      <Edit3 className="w-4 h-4 text-[#60a5fa]" />
                      <span className="hidden sm:inline">Edit Course</span>
                    </button>

                    <button
                      onClick={() => setActiveCourseIdForQuiz(course.id)}
                      className="p-2 rounded-xl bg-[#a855f7]/15 hover:bg-[#a855f7]/25 text-[#c084fc] border border-[#a855f7]/30 text-xs font-semibold flex items-center space-x-1"
                    >
                      <HelpCircle className="w-4 h-4 text-[#c084fc]" />
                      <span>{course.quiz ? 'Edit Quiz' : 'Add Quiz'}</span>
                    </button>

                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Lessons Sub-Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#3b82f6]" />
                    <span>Lesson Syllabus ({course.lessons?.length || 0} Lessons)</span>
                  </h4>

                  {isOwnerOrFullCM && (
                    <button
                      onClick={() => {
                        setActiveCourseIdForLesson(course.id);
                        setLessonToEdit(null);
                      }}
                      className="flex items-center space-x-1 text-xs font-semibold text-[#3b82f6] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>
                  )}
                </div>

                {course.lessons && course.lessons.length > 0 ? (
                  <div className="space-y-2">
                    {course.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className="p-3 bg-[#1a2436] rounded-xl border border-slate-800/80 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            #{idx + 1}
                          </span>
                          {lesson.type === 'video' ? (
                            <Video className="w-4 h-4 text-[#60a5fa]" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#34d399]" />
                          )}
                          <div>
                            <span className="text-xs font-semibold text-white">{lesson.title}</span>
                            <div className="text-[10px] text-slate-400">
                              {lesson.durationMinutes} min • {lesson.type}
                            </div>
                          </div>
                        </div>

                        {isOwnerOrFullCM && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setActiveCourseIdForLesson(course.id);
                                setLessonToEdit(lesson);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteLesson(course.id, lesson.id)}
                              className="p-1 rounded text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-[#1a2436]/40 rounded-xl border border-slate-800/60 text-xs text-slate-500">
                    No lessons created yet. Click "Add Lesson" to add content.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showCourseModal && <CourseModal courseToEdit={courseToEdit} onClose={() => setShowCourseModal(false)} />}
      {activeCourseIdForLesson && (
        <LessonModal
          courseId={activeCourseIdForLesson}
          lessonToEdit={lessonToEdit}
          onClose={() => {
            setActiveCourseIdForLesson(null);
            setLessonToEdit(null);
          }}
        />
      )}
      {activeCourseIdForQuiz && (
        <QuizBuilderModal courseId={activeCourseIdForQuiz} onClose={() => setActiveCourseIdForQuiz(null)} />
      )}
    </div>
  );
};
