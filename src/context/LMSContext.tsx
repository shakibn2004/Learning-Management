'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Course, Lesson, Quiz, QuizAttempt, UserCourseProgress, BlogPost } from '../types';

interface LMSContextType {
  currentUser: User;
  users: User[];
  courses: Course[];
  progress: UserCourseProgress[];
  blogPosts: BlogPost[];
  quizAttempts: QuizAttempt[];
  activeRole: UserRole;
  isLoading: boolean;
  switchRole: (role: UserRole) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  enrollInCourse: (courseId: string) => void;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  saveCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  saveLesson: (courseId: string, lesson: Lesson) => void;
  deleteLesson: (courseId: string, lessonId: string) => void;
  saveQuiz: (courseId: string, quiz: Quiz) => void;
  submitQuizAttempt: (quizId: string, answers: Record<string, string>) => QuizAttempt;
  saveBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
  toggleBlogStatus: (postId: string) => void;
  getCourseProgress: (userId: string, courseId: string) => number;
  isLessonCompleted: (userId: string, courseId: string, lessonId: string) => boolean;
  canPerformAction: (action: PermissionAction, targetOwnerId?: string) => boolean;
}

export type PermissionAction =
  | 'manage_users'
  | 'create_course'
  | 'edit_course'
  | 'delete_course'
  | 'add_lesson'
  | 'edit_lesson'
  | 'delete_lesson'
  | 'create_quiz'
  | 'view_student_progress'
  | 'manage_blogs'
  | 'enroll_course'
  | 'take_quiz';

const LMSContext = createContext<LMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'lms_master_state_v1';

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserCourseProgress[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('Admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Current active user matching current selected role or fallback user
  const currentUser: User = users.find((u) => u.role === activeRole) || users[0] || {
    id: `user-${activeRole.toLowerCase().replace(/\s+/g, '-')}`,
    name: `${activeRole} User`,
    email: `${activeRole.toLowerCase().replace(/\s+/g, '.')}@learnhub.com`,
    role: activeRole,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
    createdAt: new Date().toISOString(),
  };

  const strapiRequest = async (path: string, method = 'GET', body?: any) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (activeRole) {
        headers['x-user-role'] = activeRole;
      }
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.error(`Strapi request failed on ${method} ${path}:`, err);
      throw err;
    }
  };

  // Load state & fetch data from Strapi API on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Users
        const usersRes = await fetch(`${API_URL}/api/lms-users`);
        if (usersRes.ok) {
          const usersJson = await usersRes.json();
          if (usersJson?.data) {
            setUsers(
              usersJson.data.map((u: any) => ({
                id: u.documentId || String(u.id),
                name: u.name,
                email: u.email,
                role: u.role,
                avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                enrolledCourseIds: u.enrolledCourseIds || [],
                createdAt: u.createdAt,
              }))
            );
          }
        }

        // 2. Fetch Courses with populated lessons and quiz
        const coursesRes = await fetch(`${API_URL}/api/courses?populate[lessons]=*&populate[quiz]=*`);
        if (coursesRes.ok) {
          const coursesJson = await coursesRes.json();
          if (coursesJson?.data) {
            const mapped = coursesJson.data.map((c: any) => ({
              id: c.documentId || String(c.id),
              title: c.title || '',
              subtitle: c.subtitle || '',
              description: c.description || '',
              category: c.category || 'Web Development',
              level: c.level || 'Intermediate',
              coverImage: c.coverImage || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
              instructorId: c.instructorId || '',
              instructorName: c.instructorName || '',
              price: Number(c.price) || 0,
              published: c.published !== undefined ? c.published : true,
              lessons: (c.lessons || []).map((l: any) => ({
                id: l.documentId || String(l.id),
                courseId: c.documentId || String(c.id),
                title: l.title,
                durationMinutes: Number(l.durationMinutes) || 0,
                type: l.type,
                videoUrl: l.videoUrl,
                content: l.content,
                order: Number(l.order) || 1,
              })).sort((a: any, b: any) => a.order - b.order),
              quiz: c.quiz ? {
                id: c.quiz.documentId || String(c.quiz.id),
                courseId: c.documentId || String(c.id),
                title: c.quiz.title,
                description: c.quiz.description,
                passingScore: Number(c.quiz.passingScore) || 70,
                questions: c.quiz.questions || [],
              } : undefined,
              createdAt: c.createdAt || new Date().toISOString(),
            }));
            setCourses(mapped);
          }
        }

        // 3. Fetch progress
        const progRes = await fetch(`${API_URL}/api/user-course-progresses`);
        if (progRes.ok) {
          const progJson = await progRes.json();
          if (progJson?.data) {
            setProgress(
              progJson.data.map((p: any) => ({
                id: p.documentId || String(p.id),
                userId: p.userId,
                courseId: p.courseId,
                completedLessonIds: p.completedLessonIds || [],
                lastAccessedLessonId: p.lastAccessedLessonId,
                updatedAt: p.updatedAt || new Date().toISOString(),
              }))
            );
          }
        }

        // 4. Fetch blogs
        const blogsRes = await fetch(`${API_URL}/api/blog-posts`);
        if (blogsRes.ok) {
          const blogsJson = await blogsRes.json();
          if (blogsJson?.data) {
            setBlogPosts(
              blogsJson.data.map((b: any) => ({
                id: b.documentId || String(b.id),
                title: b.title,
                excerpt: b.excerpt,
                content: b.content,
                coverImage: b.coverImage,
                authorId: b.authorId,
                authorName: b.authorName,
                authorRole: b.authorRole,
                status: b.status,
                publishedAt: b.publishedAt,
                createdAt: b.createdAt,
                tags: b.tags || [],
              }))
            );
          }
        }

        // 5. Fetch quiz attempts
        const attemptsRes = await fetch(`${API_URL}/api/quiz-attempts`);
        if (attemptsRes.ok) {
          const attemptsJson = await attemptsRes.json();
          if (attemptsJson?.data) {
            setQuizAttempts(
              attemptsJson.data.map((a: any) => ({
                id: a.documentId || String(a.id),
                quizId: a.quizId,
                studentId: a.studentId,
                scorePercentage: Number(a.scorePercentage) || 0,
                passed: a.passed,
                answers: a.answers || {},
                completedAt: a.completedAt,
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to initialize LMS data from Strapi API:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initData();

    // Load active role from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeRole) {
          setActiveRole(parsed.activeRole);
        }
      }
    } catch (e) {
      console.warn('Failed to load active role from local storage', e);
    }
  }, []);

  // Save activeRole to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ activeRole })
      );
    } catch (e) {
      console.warn('Failed to persist activeRole', e);
    }
  }, [activeRole]);

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await strapiRequest(`/api/lms-users/${userId}`, 'PUT', {
        data: { role: newRole }
      });
      if (res?.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(`Error updating user role: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const already = currentUser.enrolledCourseIds.includes(courseId);
      const updatedCourseIds = already ? currentUser.enrolledCourseIds : [...currentUser.enrolledCourseIds, courseId];

      // Update user enrolled courses in Strapi
      const userRes = await strapiRequest(`/api/lms-users/${currentUser.id}`, 'PUT', {
        data: { enrolledCourseIds: updatedCourseIds }
      });

      if (userRes?.data) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === currentUser.id) {
              return {
                ...u,
                enrolledCourseIds: updatedCourseIds,
              };
            }
            return u;
          })
        );
      }

      // Initialize progress entry in Strapi if not exists
      const existingProg = progress.find((p) => p.userId === currentUser.id && p.courseId === courseId);
      if (!existingProg) {
        const progRes = await strapiRequest('/api/user-course-progresses', 'POST', {
          data: {
            userId: currentUser.id,
            courseId,
            completedLessonIds: [],
          }
        });
        if (progRes?.data) {
          const returnedProg = progRes.data;
          setProgress((prev) => [
            ...prev,
            {
              id: returnedProg.documentId || String(returnedProg.id),
              userId: currentUser.id,
              courseId,
              completedLessonIds: [],
              updatedAt: new Date().toISOString(),
            }
          ]);
        }
      }
    } catch (err) {
      alert(`Error enrolling in course: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getCourseProgress = (userId: string, courseId: string): number => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || course.lessons.length === 0) return 0;

    const userProg = progress.find((p) => p.userId === userId && p.courseId === courseId);
    if (!userProg) return 0;

    const completedCount = userProg.completedLessonIds.length;
    return Math.round((completedCount / course.lessons.length) * 100);
  };

  const isLessonCompleted = (userId: string, courseId: string, lessonId: string): boolean => {
    const userProg = progress.find((p) => p.userId === userId && p.courseId === courseId);
    return userProg ? userProg.completedLessonIds.includes(lessonId) : false;
  };

  const toggleLessonComplete = async (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    try {
      const existingIndex = progress.findIndex(
        (p) => p.userId === currentUser.id && p.courseId === courseId
      );
      
      let res;
      let newCompleted: string[] = [];

      if (existingIndex > -1) {
        const item = progress[existingIndex];
        const isComp = item.completedLessonIds.includes(lessonId);
        newCompleted = isComp
          ? item.completedLessonIds.filter((id) => id !== lessonId)
          : [...item.completedLessonIds, lessonId];
        
        const progressDocId = (item as any).id;

        if (progressDocId) {
          res = await strapiRequest(`/api/user-course-progresses/${progressDocId}`, 'PUT', {
            data: {
              completedLessonIds: newCompleted,
              lastAccessedLessonId: lessonId,
            }
          });
        } else {
          res = await strapiRequest('/api/user-course-progresses', 'POST', {
            data: {
              userId: currentUser.id,
              courseId,
              completedLessonIds: newCompleted,
              lastAccessedLessonId: lessonId,
            }
          });
        }
      } else {
        newCompleted = [lessonId];
        res = await strapiRequest('/api/user-course-progresses', 'POST', {
          data: {
            userId: currentUser.id,
            courseId,
            completedLessonIds: newCompleted,
            lastAccessedLessonId: lessonId,
          }
        });
      }

      if (res?.data) {
        const returnedProg = res.data;
        setProgress((prev) => {
          const idx = prev.findIndex(
            (p) => p.userId === currentUser.id && p.courseId === courseId
          );
          const updatedItem = {
            id: returnedProg.documentId || String(returnedProg.id),
            userId: currentUser.id,
            courseId,
            completedLessonIds: newCompleted,
            lastAccessedLessonId: lessonId,
            updatedAt: returnedProg.updatedAt || new Date().toISOString(),
          };
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = updatedItem;
            return copy;
          } else {
            return [...prev, updatedItem];
          }
        });
      }
    } catch (err) {
      alert(`Error updating lesson progress: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const saveCourse = async (courseData: Course) => {
    try {
      const isEdit = courses.some((c) => c.id === courseData.id);
      let res;
      if (isEdit) {
        res = await strapiRequest(`/api/courses/${courseData.id}`, 'PUT', {
          data: {
            title: courseData.title,
            subtitle: courseData.subtitle,
            description: courseData.description,
            category: courseData.category,
            level: courseData.level,
            coverImage: courseData.coverImage,
            instructorId: courseData.instructorId,
            instructorName: courseData.instructorName,
            price: courseData.price,
            published: courseData.published,
          }
        });
      } else {
        res = await strapiRequest('/api/courses', 'POST', {
          data: {
            documentId: courseData.id,
            title: courseData.title,
            subtitle: courseData.subtitle,
            description: courseData.description,
            category: courseData.category,
            level: courseData.level,
            coverImage: courseData.coverImage,
            instructorId: courseData.instructorId,
            instructorName: courseData.instructorName,
            price: courseData.price,
            published: courseData.published,
          }
        });
      }

      if (res?.data) {
        const returnedCourse = res.data;
        const newCourse: Course = {
          ...courseData,
          id: returnedCourse.documentId || String(returnedCourse.id),
          createdAt: returnedCourse.createdAt || courseData.createdAt,
        };
        setCourses((prev) => {
          const idx = prev.findIndex((c) => c.id === newCourse.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = newCourse;
            return copy;
          }
          return [newCourse, ...prev];
        });
      }
    } catch (err) {
      alert(`Error saving course: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await strapiRequest(`/api/courses/${courseId}`, 'DELETE');
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      alert(`Error deleting course: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const saveLesson = async (courseId: string, lessonData: Lesson) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      const isEdit = course?.lessons.some((l) => l.id === lessonData.id);
      let res;
      if (isEdit) {
        res = await strapiRequest(`/api/lessons/${lessonData.id}`, 'PUT', {
          data: {
            title: lessonData.title,
            durationMinutes: lessonData.durationMinutes,
            type: lessonData.type,
            videoUrl: lessonData.videoUrl,
            content: lessonData.content,
            order: lessonData.order,
          }
        });
      } else {
        res = await strapiRequest('/api/lessons', 'POST', {
          data: {
            documentId: lessonData.id,
            title: lessonData.title,
            durationMinutes: lessonData.durationMinutes,
            type: lessonData.type,
            videoUrl: lessonData.videoUrl,
            content: lessonData.content,
            order: lessonData.order,
            course: courseId,
          }
        });
      }

      if (res?.data) {
        const returnedLesson = res.data;
        const finalLesson: Lesson = {
          ...lessonData,
          id: returnedLesson.documentId || String(returnedLesson.id),
        };
        setCourses((prev) =>
          prev.map((c) => {
            if (c.id === courseId) {
              const existingLessons = c.lessons || [];
              const lIdx = existingLessons.findIndex((l) => l.id === finalLesson.id);
              let newLessons = [...existingLessons];
              if (lIdx > -1) {
                newLessons[lIdx] = finalLesson;
              } else {
                newLessons.push(finalLesson);
              }
              return { ...c, lessons: newLessons.sort((a, b) => a.order - b.order) };
            }
            return c;
          })
        );
      }
    } catch (err) {
      alert(`Error saving lesson: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteLesson = async (courseId: string, lessonId: string) => {
    try {
      await strapiRequest(`/api/lessons/${lessonId}`, 'DELETE');
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === courseId) {
            return {
              ...c,
              lessons: c.lessons.filter((l) => l.id !== lessonId),
            };
          }
          return c;
        })
      );
    } catch (err) {
      alert(`Error deleting lesson: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const saveQuiz = async (courseId: string, quizData: Quiz) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      const hasQuiz = !!course?.quiz;
      let res;
      if (hasQuiz) {
        res = await strapiRequest(`/api/quizzes/${quizData.id}`, 'PUT', {
          data: {
            title: quizData.title,
            description: quizData.description,
            passingScore: quizData.passingScore,
            questions: quizData.questions,
          }
        });
      } else {
        res = await strapiRequest('/api/quizzes', 'POST', {
          data: {
            documentId: quizData.id,
            title: quizData.title,
            description: quizData.description,
            passingScore: quizData.passingScore,
            questions: quizData.questions,
            course: courseId,
          }
        });
      }

      if (res?.data) {
        const returnedQuiz = res.data;
        const finalQuiz: Quiz = {
          ...quizData,
          id: returnedQuiz.documentId || String(returnedQuiz.id),
        };
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, quiz: finalQuiz } : c))
        );
      }
    } catch (err) {
      alert(`Error saving quiz: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const submitQuizAttempt = (quizId: string, answers: Record<string, string>): QuizAttempt => {
    let foundQuiz: Quiz | undefined;
    for (const c of courses) {
      if (c.quiz && c.quiz.id === quizId) {
        foundQuiz = c.quiz;
        break;
      }
    }

    let correctCount = 0;
    let totalQuestions = foundQuiz ? foundQuiz.questions.length : 1;

    if (foundQuiz) {
      foundQuiz.questions.forEach((q) => {
        if (answers[q.id] === q.correctOptionId) {
          correctCount++;
        }
      });
    }

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passingScore = foundQuiz ? foundQuiz.passingScore : 70;
    const passed = scorePercentage >= passingScore;

    const attemptId = `attempt-${Date.now()}`;
    const attempt: QuizAttempt = {
      id: attemptId,
      quizId,
      studentId: currentUser.id,
      scorePercentage,
      passed,
      answers,
      completedAt: new Date().toISOString(),
    };

    // Save async to Strapi backend
    strapiRequest('/api/quiz-attempts', 'POST', {
      data: {
        documentId: attemptId,
        quizId,
        studentId: currentUser.id,
        scorePercentage,
        passed,
        answers,
        completedAt: attempt.completedAt,
      }
    }).then((res) => {
      if (res?.data) {
        const returnedAttempt = res.data;
        setQuizAttempts((prev) => [
          {
            ...attempt,
            id: returnedAttempt.documentId || String(returnedAttempt.id),
          },
          ...prev.filter((qa) => qa.id !== attemptId),
        ]);
      }
    }).catch((err) => {
      console.error('Failed to save quiz attempt to Strapi:', err);
    });

    setQuizAttempts((prev) => [attempt, ...prev]);
    return attempt;
  };

  const saveBlogPost = async (post: BlogPost) => {
    try {
      const isEdit = blogPosts.some((b) => b.id === post.id);
      let res;
      if (isEdit) {
        res = await strapiRequest(`/api/blog-posts/${post.id}`, 'PUT', {
          data: {
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            authorId: post.authorId,
            authorName: post.authorName,
            authorRole: post.authorRole,
            status: post.status,
            publishedAt: post.publishedAt,
            tags: post.tags,
          }
        });
      } else {
        res = await strapiRequest('/api/blog-posts', 'POST', {
          data: {
            documentId: post.id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            coverImage: post.coverImage,
            authorId: post.authorId,
            authorName: post.authorName,
            authorRole: post.authorRole,
            status: post.status,
            publishedAt: post.publishedAt || (post.status === 'Published' ? new Date().toISOString() : null),
            tags: post.tags,
          }
        });
      }

      if (res?.data) {
        const returnedPost = res.data;
        const newPost: BlogPost = {
          ...post,
          id: returnedPost.documentId || String(returnedPost.id),
          publishedAt: returnedPost.publishedAt,
          createdAt: returnedPost.createdAt || post.createdAt,
        };
        setBlogPosts((prev) => {
          const idx = prev.findIndex((b) => b.id === newPost.id);
          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = newPost;
            return copy;
          }
          return [newPost, ...prev];
        });
      }
    } catch (err) {
      alert(`Error saving blog post: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    try {
      await strapiRequest(`/api/blog-posts/${postId}`, 'DELETE');
      setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(`Error deleting blog post: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const toggleBlogStatus = async (postId: string) => {
    try {
      const post = blogPosts.find((p) => p.id === postId);
      if (!post) return;
      const newStatus = post.status === 'Draft' ? 'Published' : 'Draft';
      const publishedAt = newStatus === 'Published' ? new Date().toISOString() : null;

      const res = await strapiRequest(`/api/blog-posts/${postId}`, 'PUT', {
        data: {
          status: newStatus,
          publishedAt,
        }
      });

      if (res?.data) {
        setBlogPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                status: newStatus,
                publishedAt: publishedAt || undefined,
              };
            }
            return p;
          })
        );
      }
    } catch (err) {
      alert(`Error toggling blog status: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const canPerformAction = (action: PermissionAction, targetOwnerId?: string): boolean => {
    const role = currentUser.role;

    switch (action) {
      case 'manage_users':
        return role === 'Admin';

      case 'create_course':
        return role === 'Admin' || role === 'Content Manager' || role === 'Instructor';

      case 'edit_course':
      case 'delete_course':
      case 'add_lesson':
      case 'edit_lesson':
      case 'delete_lesson':
      case 'create_quiz':
        if (role === 'Admin' || role === 'Content Manager') return true;
        if (role === 'Instructor') {
          return targetOwnerId ? targetOwnerId === currentUser.id : true;
        }
        return false;

      case 'view_student_progress':
        if (role === 'Admin' || role === 'Content Manager') return true;
        if (role === 'Instructor') {
          return targetOwnerId ? targetOwnerId === currentUser.id : true;
        }
        return role === 'Student'; // Can view own

      case 'manage_blogs':
        return role === 'Admin' || role === 'Content Manager';

      case 'enroll_course':
      case 'take_quiz':
        return role === 'Student';

      default:
        return false;
    }
  };

  return (
    <LMSContext.Provider
      value={{
        currentUser,
        users,
        courses,
        progress,
        blogPosts,
        quizAttempts,
        activeRole,
        isLoading,
        switchRole,
        updateUserRole,
        enrollInCourse,
        toggleLessonComplete,
        saveCourse,
        deleteCourse,
        saveLesson,
        deleteLesson,
        saveQuiz,
        submitQuizAttempt,
        saveBlogPost,
        deleteBlogPost,
        toggleBlogStatus,
        getCourseProgress,
        isLessonCompleted,
        canPerformAction,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
