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
  Users,
  CheckCircle2,
  Sparkles,
  Lock,
  Layers,
} from 'lucide-react';

export const ContentManagerDashboard: React.FC = () => {
  const { courses, currentUser, deleteCourse, deleteLesson, activeRole, canPerformAction } = useLMS();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [activeCourseIdForLesson, setActiveCourseIdForLesson] = useState<string | null>(null);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);

  const [activeCourseIdForQuiz, setActiveCourseIdForQuiz] = useState<string | null>(null);

  // Filter courses based on role & permissions
  // Content Manager & Admin: can see & edit all
  // Instructor: can edit owned courses only (show badge for owned)
  const displayCourses = courses.filter((course) => {
    if (activeRole === 'Admin' || activeRole === 'Content Manager') return true;
    if (activeRole === 'Instructor') return course.instructorId === currentUser.id;
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curriculum & Content Management</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            {activeRole === 'Instructor' ? 'My Courses & Lessons Management' : 'Platform Course & Quiz Directory'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {activeRole === 'Instructor'
              ? 'Manage your owned courses, construct sequential video & text lessons, and configure auto-graded quizzes.'
              : 'Platform-wide authority to construct courses, arrange lesson hierarchies, and publish auto-graded assessments.'}
          </p>
        </div>

        {canPerformAction('create_course') && (
          <button
            onClick={() => {
              setCourseToEdit(null);
              setShowCourseModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        )}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {displayCourses.map((course) => {
          const isOwnerOrFullCM =
            activeRole === 'Admin' ||
            activeRole === 'Content Manager' ||
            (activeRole === 'Instructor' && course.instructorId === currentUser.id);

          return (
            <div key={course.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Course Top Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
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
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Draft
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{course.subtitle}</p>
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-4">
                      <span>Instructor: <strong className="text-slate-200">{course.instructorName}</strong></span>
                      <span>Price: <strong className="text-emerald-400">${course.price}</strong></span>
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
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Edit3 className="w-4 h-4 text-indigo-400" />
                      <span className="hidden sm:inline">Edit Course</span>
                    </button>

                    <button
                      onClick={() => setActiveCourseIdForQuiz(course.id)}
                      className="p-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center space-x-1"
                    >
                      <HelpCircle className="w-4 h-4 text-purple-400" />
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
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Lesson Syllabus ({course.lessons?.length || 0} Lessons)</span>
                  </h4>

                  {isOwnerOrFullCM && (
                    <button
                      onClick={() => {
                        setActiveCourseIdForLesson(course.id);
                        setLessonToEdit(null);
                      }}
                      className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
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
                        className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-mono font-bold text-slate-500">
                            #{idx + 1}
                          </span>
                          {lesson.type === 'video' ? (
                            <Video className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-400" />
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
                  <div className="p-4 text-center bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs text-slate-500">
                    No lessons created yet. Click "Add Lesson" to add content.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <CourseModal courseToEdit={courseToEdit} onClose={() => setShowCourseModal(false)} />
      )}

      {/* Lesson Modal */}
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

      {/* Quiz Builder Modal */}
      {activeCourseIdForQuiz && (
        <QuizBuilderModal
          courseId={activeCourseIdForQuiz}
          onClose={() => setActiveCourseIdForQuiz(null)}
        />
      )}
    </div>
  );
};
