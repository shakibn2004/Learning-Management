'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Lesson } from '../types';
import { X, Video, FileText, PlusCircle } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const lessonData: Lesson = {
      id: lessonToEdit?.id || `lesson-${Date.now()}`,
      courseId,
      title,
      durationMinutes: Number(durationMinutes),
      type,
      videoUrl: type === 'video' ? videoUrl : undefined,
      content,
      order: lessonToEdit?.order || nextOrder,
    };

    saveLesson(courseId, lessonData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <PlusCircle className="w-6 h-6 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">
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
              className="glass-input w-full px-3 py-2 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lesson Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="glass-input w-full px-3 py-2 rounded-xl bg-slate-900 text-slate-200"
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
                className="glass-input w-full px-3 py-2 rounded-xl"
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
                className="glass-input w-full px-3 py-2 rounded-xl text-slate-300 font-mono text-[11px]"
              />
              <p className="text-[10px] text-slate-500 mt-1">Supports YouTube embed URLs or HTML5 MP4 links.</p>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lesson Content / Notes (Markdown Supported)</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Detailed lesson transcript, code snippets, or reading material..."
              className="glass-input w-full px-3 py-2 rounded-xl font-mono text-xs"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-500/20"
            >
              {lessonToEdit ? 'Save Changes' : 'Add Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
