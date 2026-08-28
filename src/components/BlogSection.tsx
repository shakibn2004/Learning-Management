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
  Search,
  BookOpen,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  FileEdit,
  Tag,
  Share2,
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { blogPosts, currentUser, activeRole, saveBlogPost, deleteBlogPost, toggleBlogStatus, canPerformAction } = useLMS();

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postToEdit, setPostToEdit] = useState<BlogPost | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

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
      publishedAt: status === 'Published' ? (postToEdit?.publishedAt || new Date().toISOString()) : undefined,
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

  // Extract all unique tags
  const allTags = Array.from(
    new Set(blogPosts.flatMap((p) => p.tags || []))
  );

  const filteredPosts = visiblePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      selectedTag === 'ALL' || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const publishedCount = blogPosts.filter((b) => b.status === 'Published').length;
  const draftCount = blogPosts.filter((b) => b.status === 'Draft').length;
  const uniqueAuthors = new Set(blogPosts.map((b) => b.authorId)).size;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Editorial & Engineering Publications</h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Read engineering insights, architecture deep-dives, and system updates. Role-based authoring with instant Strapi sync.
          </p>
        </div>

        {canPerformAction('manage_blogs') && (
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 shrink-0 self-start sm:self-auto transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Write New Article</span>
          </button>
        )}
      </div>

      {/* 1. TOP 4 STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Articles</span>
            <div className="text-2xl font-extrabold text-[#34d399] mt-1">{blogPosts.length}</div>
            <div className="text-[11px] text-[#34d399] font-medium mt-1">Platform publications</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
            <Newspaper className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Live Published</span>
            <div className="text-2xl font-extrabold text-[#60a5fa] mt-1">{publishedCount}</div>
            <div className="text-[11px] text-[#60a5fa] font-medium mt-1">Publicly accessible</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Editorial Drafts</span>
            <div className="text-2xl font-extrabold text-[#fb923c] mt-1">{draftCount}</div>
            <div className="text-[11px] text-[#fb923c] font-medium mt-1">In review & editing</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#f97316]/15 border border-[#f97316]/30 flex items-center justify-center text-[#fb923c]">
            <FileEdit className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#141d2b] p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Contributing Authors</span>
            <div className="text-2xl font-extrabold text-[#c084fc] mt-1">{uniqueAuthors}</div>
            <div className="text-[11px] text-[#c084fc] font-medium mt-1">Admins & Managers</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY TAG PILLS */}
      <div className="bg-[#141d2b] p-4 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search articles by title, topic, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a2436] text-xs pl-10 pr-4 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedTag === 'ALL'
                ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                : 'bg-[#1a2436] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Articles
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedTag === tag
                  ? 'bg-[#3b82f6] text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#1a2436] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. BLOG CARDS GRID */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const canManage =
              activeRole === 'Admin' ||
              (activeRole === 'Content Manager' && (post.authorId === currentUser.id || activeRole === 'Content Manager'));

            return (
              <div
                key={post.id}
                className="bg-[#141d2b] rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141d2b] via-transparent to-black/30"></div>
                    
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      {post.status === 'Published' ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#10b981]/90 backdrop-blur-md text-white shadow-sm border border-[#10b981]/40">
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#f59e0b]/90 backdrop-blur-md text-white shadow-sm border border-[#f59e0b]/40">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-[#0f172a]/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-[#60a5fa]" />
                      <span>3 min read</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#60a5fa] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                          {post.authorName[0]}
                        </div>
                        <span className="font-medium text-slate-300">{post.authorName}</span>
                      </div>
                      <span className="text-slate-500 font-mono">
                        {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-3 mt-2">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#1a2436] hover:bg-[#3b82f6] text-white rounded-xl text-xs font-semibold border border-slate-800 hover:border-transparent transition-all shadow-sm group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#3b82f6] group-hover/btn:text-white" />
                    <span>Read Full Article</span>
                  </button>

                  {canManage && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => toggleBlogStatus(post.id)}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                          post.status === 'Draft'
                            ? 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30 hover:bg-[#10b981]/25'
                            : 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30 hover:bg-[#f59e0b]/25'
                        }`}
                        title="Toggle Publish Status"
                      >
                        {post.status === 'Draft' ? 'Publish' : 'Unpublish'}
                      </button>

                      <button
                        onClick={() => openModal(post)}
                        className="p-2 rounded-xl bg-[#1a2436] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteBlogPost(post.id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:bg-rose-500/20"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#141d2b] rounded-2xl border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No articles match your search</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing your filters or search keywords.</p>
        </div>
      )}

      {/* Read Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141d2b] w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center text-[#60a5fa]">
                  <Newspaper className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Publication Reader
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-56 sm:h-72 object-cover"
                />
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {selectedPost.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 pb-4 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <span>By {selectedPost.authorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {selectedPost.authorRole}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {new Date(selectedPost.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    3 min read
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-8 bg-[#1a2436] rounded-2xl border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-4 shadow-inner">
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
                  placeholder="e.g. Next.js 15 Server Components and Architecture..."
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
