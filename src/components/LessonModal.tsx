'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Lesson } from '../types';
import { X, PlusCircle } from 'lucide-react';

interface LessonModalProps {
  courseId: string;
  lessonToEdit?: Lesson | null;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ courseId, lessonToEdit, onClose }) => {
  const { saveLesson, courses } = useLMS();

  const currentCourse = courses.find((c) => c.id === courseId);
  const nextOrder = (currentCourse?.lessons?.length || 0) + 1;

  const [title, setTitle] = useState(lessonToEdit?.title || '');
  const [durationMinutes, setDurationMinutes] = useState(lessonToEdit?.durationMinutes || 15);
  const [type, setType] = useState<'video' | 'text'>(lessonToEdit?.type || 'video');
  const [videoUrl, setVideoUrl] = useState(lessonToEdit?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [content, setContent] = useState(lessonToEdit?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    const lessonData: Lesson = {
      id: lessonToEdit?.id || `lesson-${Date.now()}`,
      courseId,
      title: title.trim(),
      durationMinutes: Number(durationMinutes),
      type,
      videoUrl: type === 'video' ? videoUrl : undefined,
      content,
      order: lessonToEdit?.order || nextOrder,
    };

    setIsSubmitting(true);
    try {
      await saveLesson(courseId, lessonData);
      onClose();
    } catch (err) {
      console.error('Failed to save lesson:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141d2b] w-full max-w-xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-[#3b82f6]" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {lessonToEdit ? 'Edit Lesson' : 'Add Lesson to Course'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lesson Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1. Introduction to Next.js App Router"
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="video">Video Lesson</option>
                <option value="text">Text / Markdown Article</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 1)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          {type === 'video' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Video Embed / Stream URL</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 font-mono text-[11px] focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lesson Content / Notes</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed lesson transcript, code snippets, or reading material..."
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 font-mono text-xs focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1a2436] hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{lessonToEdit ? 'Save Changes' : 'Add Lesson'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
