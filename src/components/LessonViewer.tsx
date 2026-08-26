'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course, Lesson } from '../types';
import {
  X,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Award,
  Sparkles,
} from 'lucide-react';

interface LessonViewerProps {
  course: Course;
  initialLessonId?: string;
  onClose: () => void;
  onOpenQuiz?: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  initialLessonId,
  onClose,
  onOpenQuiz,
}) => {
  const { currentUser, toggleLessonComplete, isLessonCompleted, getCourseProgress } = useLMS();

  const lessons = course.lessons || [];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialLessonId || (lessons[0]?.id ?? '')
  );

  const currentLessonIndex = lessons.findIndex((l) => l.id === selectedLessonId);
  const currentLesson = lessons[currentLessonIndex] || lessons[0];

  const progressPct = getCourseProgress(currentUser.id, course.id);
  const isCurrentCompleted = currentLesson
    ? isLessonCompleted(currentUser.id, course.id, currentLesson.id)
    : false;

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setSelectedLessonId(lessons[currentLessonIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setSelectedLessonId(lessons[currentLessonIndex - 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-hidden">
      <div className="glass-panel w-full max-w-6xl h-[92vh] rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-white truncate">{course.title}</h3>
              <p className="text-xs text-slate-400 truncate">
                Lesson {currentLessonIndex + 1} of {lessons.length}: {currentLesson?.title}
              </p>
            </div>
          </div>

          {/* Progress Bar & Close */}
          <div className="flex items-center space-x-6 shrink-0">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-36 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-indigo-300">{progressPct}% Complete</span>
            </div>

            {course.quiz && (
              <button
                onClick={onOpenQuiz}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold"
              >
                <Award className="w-4 h-4 text-purple-400" />
                <span>Take Course Quiz</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Left Sidebar + Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Syllabus Navigation Left Sidebar */}
          <div className="w-full lg:w-80 glass-panel border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 space-y-3 overflow-y-auto shrink-0 bg-slate-900/50">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Course Syllabus
              </span>
              <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                {lessons.filter((l) => isLessonCompleted(currentUser.id, course.id, l.id)).length}/
                {lessons.length} Done
              </span>
            </div>

            <div className="space-y-1.5">
              {lessons.map((lesson, idx) => {
                const isSelected = lesson.id === selectedLessonId;
                const isComp = isLessonCompleted(currentUser.id, course.id, lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/50 text-white font-semibold shadow-md'
                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isComp ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="line-clamp-1">{lesson.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {lesson.durationMinutes} min • {lesson.type}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Lesson Player */}
          <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6 bg-slate-950/60">
            {currentLesson ? (
              <>
                {/* Media Container */}
                {currentLesson.type === 'video' && currentLesson.videoUrl && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black relative">
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Lesson Header & Mark Complete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentLesson.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Estimated Duration: {currentLesson.durationMinutes} minutes
                    </p>
                  </div>

                  <button
                    onClick={() => toggleLessonComplete(course.id, currentLesson.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                      isCurrentCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCompleted ? 'Lesson Completed' : 'Mark as Complete'}</span>
                  </button>
                </div>

                {/* Text Content / Notes */}
                <div className="p-6 rounded-2xl glass-panel border border-slate-800 text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                    Lesson Study Material & Code Notes
                  </h4>
                  <div className="whitespace-pre-line text-xs font-mono bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-slate-200 overflow-x-auto">
                    {currentLesson.content || 'No text material provided for this lesson.'}
                  </div>
                </div>

                {/* Prev / Next Navigation Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <button
                    onClick={handlePrev}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Lesson</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentLessonIndex === lessons.length - 1}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md shadow-indigo-500/20"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500 text-sm">No lesson selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
