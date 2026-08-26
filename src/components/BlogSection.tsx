'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { BlogPost } from '../types';
import {
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  Eye,
  X,
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, currentUser, activeRole, saveBlogPost, deleteBlogPost, toggleBlogStatus, canPerformAction } = useLMS();

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  );
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');
  const [tagsInput, setTagsInput] = useState('Architecture, Next.js');

  const openModal = (post?: BlogPost) => {
    if (post) {
      setPostToEdit(post);
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setCoverImage(post.coverImage);
      setStatus(post.status);
      setTagsInput(post.tags?.join(', ') || '');
    } else {
      setPostToEdit(null);
      setTitle('');
      setExcerpt('');
      setContent('');
      setCoverImage('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');
      setStatus('Published');
      setTagsInput('Tech, Learning');
    }
    setShowCreateModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost: BlogPost = {
      id: postToEdit?.id || `blog-${Date.now()}`,
      title,
      excerpt,
      content,
      coverImage,
      authorId: postToEdit?.authorId || currentUser.id,
      authorName: postToEdit?.authorName || currentUser.name,
      authorRole: postToEdit?.authorRole || currentUser.role,
      status,
      publishedAt: status === 'Published' ? new Date().toISOString() : postToEdit?.publishedAt,
      createdAt: postToEdit?.createdAt || new Date().toISOString(),
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    saveBlogPost(newPost);
    setShowCreateModal(false);
  };

  const visiblePosts = blogPosts.filter((post) => {
    if (activeRole === 'Admin' || activeRole === 'Content Manager') return true;
    return post.status === 'Published';
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">LMS Editorial & Technical Blog</h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Read engineering insights and platform updates. Content Managers and Admins can write articles and toggle Draft vs Published state.
          </p>
        </div>

        {canPerformAction('manage_blogs') && (
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        )}
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post) => {
          const canManage =
            activeRole === 'Admin' ||
            (activeRole === 'Content Manager' && (post.authorId === currentUser.id || activeRole === 'Content Manager'));

          return (
            <div
              key={post.id}
              className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-2">
                    {post.status === 'Published' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#10b981]/90 backdrop-blur-md text-white">
                        Published
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f59e0b]/90 backdrop-blur-md text-white">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((t) => (
                      <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1a2436] text-[#60a5fa]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3">{post.excerpt}</p>

                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/80">
                    <span>By {post.authorName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3 mt-2">
                <button
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a2436] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-800"
                >
                  <Eye className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span>Read Article</span>
                </button>

                {canManage && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleBlogStatus(post.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border ${
                        post.status === 'Draft'
                          ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30'
                          : 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30'
                      }`}
                    >
                      {post.status === 'Draft' ? 'Publish' : 'Unpublish'}
                    </button>

                    <button
                      onClick={() => openModal(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteBlogPost(post.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Read Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
              <div className="flex items-center space-x-2">
                <Newspaper className="w-5 h-5 text-[#3b82f6]" />
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Article Reader</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-48 sm:h-64 rounded-xl object-cover border border-slate-800"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedPost.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>Written by <strong className="text-slate-200">{selectedPost.authorName}</strong></span>
                <span>• Role: {selectedPost.authorRole}</span>
                <span>• Date: {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="p-4 sm:p-6 bg-[#1a2436] rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {postToEdit ? 'Edit Blog Article' : 'Write New Blog Article'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of article..."
                  className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary snippet for list cards..."
                  className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                  >
                    <option value="Published">Published (Visible to All)</option>
                    <option value="Draft">Draft (CM/Admin Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Next.js, Strapi, Architecture"
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
                <label className="block text-slate-300 font-semibold mb-1">Article Body *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write full article body text..."
                  className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-[#1a2436] hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20"
                >
                  {postToEdit ? 'Save Changes' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
