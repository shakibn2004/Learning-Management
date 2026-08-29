'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course } from '../types';
import {
  X,
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
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
  const completedLessonsCount = lessons.filter((l) =>
    isLessonCompleted(currentUser.id, course.id, l.id)
  ).length;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141d2b] w-full max-w-6xl h-[92vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#0f172a]/95 z-10">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{course.title}</h3>
              <p className="text-[11px] text-slate-400 truncate">
                Lesson {currentLessonIndex + 1} of {lessons.length}: {currentLesson?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6 shrink-0">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-32 bg-[#1a2436] h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPct === 100 ? 'bg-[#10b981]' : 'bg-[#3b82f6]'
                  }`}
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-[#60a5fa]">
                {completedLessonsCount} of {lessons.length} done ({progressPct}%)
              </span>
            </div>

            {course.quiz && (
              <button
                onClick={onOpenQuiz}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#a855f7]/15 hover:bg-[#a855f7]/25 border border-[#a855f7]/30 text-[#c084fc] text-xs font-semibold"
              >
                <Award className="w-3.5 h-3.5 text-[#c084fc]" />
                <span className="hidden sm:inline">Quiz</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Left Sidebar + Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Syllabus Navigation Left Sidebar */}
          <div className="w-full lg:w-80 bg-[#0f172a] border-b lg:border-b-0 lg:border-r border-slate-800/80 p-3 sm:p-4 space-y-3 overflow-y-auto shrink-0 max-h-48 lg:max-h-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Course Syllabus
              </span>
              <span className="text-[10px] font-mono text-[#60a5fa]">
                {completedLessonsCount}/{lessons.length} Done
              </span>
            </div>

            <div className="space-y-1">
              {lessons.map((lesson) => {
                const isSelected = lesson.id === selectedLessonId;
                const isComp = isLessonCompleted(currentUser.id, course.id, lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start space-x-2.5 ${
                      isSelected
                        ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/40 text-white font-semibold'
                        : 'hover:bg-[#1a2436] text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isComp ? (
                        <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
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
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#141d2b]">
            {currentLesson ? (
              <>
                {/* Media Container */}
                {currentLesson.type === 'video' && currentLesson.videoUrl && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-black relative shrink-0">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-[#1a2436] border border-slate-800">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">{currentLesson.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Duration: {currentLesson.durationMinutes} minutes
                    </p>
                  </div>

                  <button
                    onClick={() => toggleLessonComplete(course.id, currentLesson.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-auto ${
                      isCurrentCompleted
                        ? 'bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/30'
                        : 'bg-[#3b82f6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>

                {/* Text Content / Notes */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#1a2436] border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                  <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#60a5fa]">
                    Lesson Study Material & Notes
                  </h4>
                  <div className="whitespace-pre-line text-xs font-mono bg-[#0f172a] p-3.5 rounded-lg border border-slate-800 text-slate-200 overflow-x-auto">
                    {currentLesson.content || 'No text material provided for this lesson.'}
                  </div>
                </div>

                {/* Prev / Next Navigation Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-auto">
                  <button
                    onClick={handlePrev}
                    disabled={currentLessonIndex === 0}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1a2436] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 border border-slate-800"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentLessonIndex === lessons.length - 1}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#3b82f6] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md shadow-blue-500/20"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">No lesson selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
