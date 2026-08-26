'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Course } from '../types';
import { X, BookOpen } from 'lucide-react';

interface CourseModalProps {
  courseToEdit?: Course | null;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ courseToEdit, onClose }) => {
  const { saveCourse, currentUser } = useLMS();

  const [title, setTitle] = useState(courseToEdit?.title || '');
  const [subtitle, setSubtitle] = useState(courseToEdit?.subtitle || '');
  const [description, setDescription] = useState(courseToEdit?.description || '');
  const [category, setCategory] = useState(courseToEdit?.category || 'Web Development');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    courseToEdit?.level || 'Beginner'
  );
  const [coverImage, setCoverImage] = useState(
    courseToEdit?.coverImage ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  );
  const [price, setPrice] = useState(courseToEdit?.price || 49.99);
  const [published, setPublished] = useState(courseToEdit ? courseToEdit.published : true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const courseData: Course = {
      id: courseToEdit?.id || `course-${Date.now()}`,
      title,
      subtitle,
      description,
      category,
      level,
      coverImage,
      instructorId: courseToEdit?.instructorId || currentUser.id,
      instructorName: courseToEdit?.instructorName || currentUser.name,
      price: Number(price),
      published,
      lessons: courseToEdit?.lessons || [],
      quiz: courseToEdit?.quiz,
      createdAt: courseToEdit?.createdAt || new Date().toISOString(),
    };

    saveCourse(courseData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141d2b] w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#3b82f6]" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {courseToEdit ? 'Edit Course' : 'Create New Course'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Course Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next.js 14 Full Stack Development"
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Master App Router, React Server Components, and Headless Strapi CMS"
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="Web Development">Web Development</option>
                <option value="Design & UI/UX">Design & UI/UX</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Data Science">Data Science</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Difficulty Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 font-mono text-[11px] focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Course Overview & Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Comprehensive description of syllabus, prerequisites, and learning outcomes..."
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="pubCheck"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded bg-[#1a2436] border-slate-700 text-[#3b82f6] focus:ring-[#3b82f6] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="pubCheck" className="text-slate-300 text-xs font-semibold cursor-pointer">
              Publish Course Immediately (Visible to Students)
            </label>
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
              className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20"
            >
              {courseToEdit ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
