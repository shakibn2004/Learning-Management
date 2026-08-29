'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Course, Lesson, Quiz, QuizAttempt, UserCourseProgress, BlogPost } from '../types';
import { useToast } from './ToastContext';

interface LMSContextType {
  currentUser: User;
  users: User[];
  courses: Course[];
  progress: UserCourseProgress[];
  blogPosts: BlogPost[];
  quizAttempts: QuizAttempt[];
  activeRole: UserRole;
  isLoading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
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
const AUTH_TOKEN_KEY = 'lms_auth_token';
const AUTH_USER_KEY = 'lms_auth_user';
const COURSES_CACHE_KEY = 'lms_cached_courses_v2';

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserCourseProgress[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>('Admin');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Authentication states
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const isAuthenticated = !!authToken && !!authUser;

  // Use Next.js proxy in browser to avoid CORS/IP issues. Use absolute URL in SSR.
  const API_URL = typeof window !== 'undefined'
    ? '/strapi-api'
    : (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api');

  // Current active user: preference given to authenticated user, else user from fetched database
  const currentUser: User =
    authUser ||
    users.find((u) => u.role === activeRole) ||
    users[0] || {
      id: '',
      name: 'Guest User',
      email: '',
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
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      const roleToSend = authUser?.role || currentUser?.role || activeRole || 'Admin';
      headers['x-user-role'] = roleToSend;
      if (currentUser?.id) {
        headers['x-user-id'] = currentUser.id;
      }

      // If path starts with /api, remove it for the proxy rewrite (/strapi-api -> /api)
      let cleanPath = path;
      if (cleanPath.startsWith('/api')) {
        cleanPath = cleanPath.replace(/^\/api/, '');
      }
      if (!cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
      }
      
      const targetUrl = `${API_URL}${cleanPath}`;

      const res = await fetch(targetUrl, {
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

      // 0. Pre-load cached courses from localStorage if available
      try {
        const cached = localStorage.getItem(COURSES_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCourses(parsed);
          }
        }
      } catch (e) {
        console.warn('Failed to parse cached courses', e);
      }

      try {
        // Restore session from localStorage if available
        const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = localStorage.getItem(AUTH_USER_KEY);
        if (savedToken && savedUser) {
          try {
            const parsedUser: User = JSON.parse(savedUser);
            setAuthToken(savedToken);
            setAuthUser(parsedUser);
            setActiveRole(parsedUser.role);
          } catch (e) {
            console.warn('Failed to parse saved user', e);
          }
        }

        // 1. Fetch Users (isolated try)
        try {
          const usersRes = await strapiRequest('/api/lms-users');
          if (usersRes?.data) {
            setUsers(
              usersRes.data.map((u: any) => ({
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
        } catch (err) {
          console.warn('Users fetch failed:', err);
        }

        // 2. Fetch Courses with populated lessons and quiz (isolated try)
        try {
          const coursesRes = await strapiRequest('/api/courses?populate[lessons]=*&populate[quiz]=*&pagination[pageSize]=100');
          if (coursesRes?.data) {
            const mapped: Course[] = coursesRes.data.map((c: any) => ({
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
            try {
              localStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(mapped));
            } catch (e) {}
          }
        } catch (err) {
          console.warn('Courses fetch failed:', err);
        }

        // 3. Fetch progress (isolated try)
        try {
          const progRes = await strapiRequest('/api/user-course-progresses');
          if (progRes?.data) {
            setProgress(
              progRes.data.map((p: any) => ({
                id: p.documentId || String(p.id),
                userId: p.userId,
                courseId: p.courseId,
                completedLessonIds: p.completedLessonIds || [],
                lastAccessedLessonId: p.lastAccessedLessonId,
                updatedAt: p.updatedAt || new Date().toISOString(),
              }))
            );
          }
        } catch (err) {
          console.warn('Progress fetch failed:', err);
        }

        // 4. Fetch blogs (isolated try)
        try {
          const blogsRes = await strapiRequest('/api/blog-posts');
          if (blogsRes?.data) {
            setBlogPosts(
              blogsRes.data.map((b: any) => ({
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
        } catch (err) {
          console.warn('Blogs fetch failed:', err);
        }

        // 5. Fetch quiz attempts (isolated try)
        try {
          const attemptsRes = await strapiRequest('/api/quiz-attempts');
          if (attemptsRes?.data) {
            setQuizAttempts(
              attemptsRes.data.map((a: any) => ({
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
        } catch (err) {
          console.warn('Quiz attempts fetch failed:', err);
        }
      } catch (err) {
        console.error('Failed to initialize LMS data from Strapi API:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initData();

    // Load active role from localStorage if no logged-in user
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && !localStorage.getItem(AUTH_USER_KEY)) {
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
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ activeRole }));
    } catch (e) {
      console.warn('Failed to persist activeRole', e);
    }
  }, [activeRole]);

  // Authentication Methods
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const data = await strapiRequest('/api/lms-users/login', 'POST', { email, password });

      if (!data || !data.jwt) {
        return {
          success: false,
          error: data?.error || 'Login failed. Please check your credentials.',
        };
      }

      setAuthToken(data.jwt);
      setAuthUser(data.user);
      setActiveRole(data.user.role);

      localStorage.setItem(AUTH_TOKEN_KEY, data.jwt);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login' };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    avatar?: string;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const data = await strapiRequest('/api/lms-users/register', 'POST', userData);

      if (!data || !data.jwt) {
        return {
          success: false,
          error: data?.error || 'Registration failed. Email may already be registered.',
        };
      }

      setAuthToken(data.jwt);
      setAuthUser(data.user);
      setActiveRole(data.user.role);

      localStorage.setItem(AUTH_TOKEN_KEY, data.jwt);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));

      // Append to local users state
      setUsers((prev) => [data.user, ...prev]);

      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration' };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setAuthUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    // If switching persona while not logged in as specific user, update authUser if matches
    const matching = users.find((u) => u.role === role);
    if (matching && !authUser) {
      // Keep selected
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await strapiRequest(`/api/lms-users/${userId}`, 'PUT', {
        data: { role: newRole },
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      if (authUser?.id === userId) {
        const updatedUser = { ...authUser, role: newRole };
        setAuthUser(updatedUser);
        setActiveRole(newRole);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
      }

      toast.success('Role Updated in Database', `User role successfully changed to ${newRole}.`);
    } catch (err: any) {
      console.error('Role update error:', err);
      toast.error('Database Sync Failed', err.message || 'Could not update user role in database.');
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const already = currentUser.enrolledCourseIds.includes(courseId);
      const updatedCourseIds = already ? currentUser.enrolledCourseIds : [...currentUser.enrolledCourseIds, courseId];

      const userRes = await strapiRequest(`/api/lms-users/${currentUser.id}`, 'PUT', {
        data: { enrolledCourseIds: updatedCourseIds },
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
        if (authUser?.id === currentUser.id) {
          const updated = { ...authUser, enrolledCourseIds: updatedCourseIds };
          setAuthUser(updated);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
        }
      }

      // Initialize progress entry in Strapi if not exists
      const existingProg = progress.find((p) => p.userId === currentUser.id && p.courseId === courseId);
      if (!existingProg) {
        const progRes = await strapiRequest('/api/user-course-progresses', 'POST', {
          data: {
            userId: currentUser.id,
            courseId,
            completedLessonIds: [],
          },
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
            },
          ]);
        }
      }
    } catch (err) {
      toast.error('Enrollment Failed', `${err instanceof Error ? err.message : String(err)}`);
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
            },
          });
        } else {
          res = await strapiRequest('/api/user-course-progresses', 'POST', {
            data: {
              userId: currentUser.id,
              courseId,
              completedLessonIds: newCompleted,
              lastAccessedLessonId: lessonId,
            },
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
          },
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
      toast.error('Progress Update Error', `${err instanceof Error ? err.message : String(err)}`);
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
          },
        });
      } else {
        res = await strapiRequest('/api/courses', 'POST', {
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
          },
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
          let updated: Course[];
          if (idx > -1) {
            updated = [...prev];
            updated[idx] = newCourse;
          } else {
            updated = [newCourse, ...prev];
          }
          try {
            localStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
        toast.success('Course Saved', `"${courseData.title}" was successfully saved.`);
      }
    } catch (err) {
      toast.error('Failed to Save Course', `${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await strapiRequest(`/api/courses/${courseId}`, 'DELETE');
      setCourses((prev) => {
        const updated = prev.filter((c) => c.id !== courseId);
        try {
          localStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
      toast.success('Course Deleted', 'Course successfully removed.');
    } catch (err) {
      toast.error('Failed to Delete Course', `${err instanceof Error ? err.message : String(err)}`);
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
          },
        });
      } else {
        res = await strapiRequest('/api/lessons', 'POST', {
          data: {
            title: lessonData.title,
            durationMinutes: lessonData.durationMinutes,
            type: lessonData.type,
            videoUrl: lessonData.videoUrl,
            content: lessonData.content,
            order: lessonData.order,
            course: courseId,
          },
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
        toast.success('Lesson Saved', `"${lessonData.title}" syllabus updated.`);
      }
    } catch (err) {
      toast.error('Failed to Save Lesson', `${err instanceof Error ? err.message : String(err)}`);
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
      toast.success('Lesson Removed', 'Lesson removed from syllabus.');
    } catch (err) {
      toast.error('Failed to Delete Lesson', `${err instanceof Error ? err.message : String(err)}`);
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
          },
        });
      } else {
        res = await strapiRequest('/api/quizzes', 'POST', {
          data: {
            title: quizData.title,
            description: quizData.description,
            passingScore: quizData.passingScore,
            questions: quizData.questions,
            course: courseId,
          },
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
        toast.success('Quiz Configured', 'Quiz assessment updated.');
      }
    } catch (err) {
      toast.error('Failed to Save Quiz', `${err instanceof Error ? err.message : String(err)}`);
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

    strapiRequest('/api/quiz-attempts', 'POST', {
      data: {
        quizId,
        studentId: currentUser.id,
        scorePercentage,
        passed,
        answers,
        completedAt: attempt.completedAt,
      },
    })
      .then((res) => {
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
      })
      .catch((err) => {
        console.error('Failed to save quiz attempt to Strapi:', err);
      });

    setQuizAttempts((prev) => [attempt, ...prev]);
    if (passed) {
      toast.success('Quiz Passed! 🎉', `You scored ${scorePercentage}%.`);
    } else {
      toast.info('Quiz Completed', `Score: ${scorePercentage}%. Passing score is ${passingScore}%.`);
    }
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
          },
        });
      } else {
        res = await strapiRequest('/api/blog-posts', 'POST', {
          data: {
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
          },
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
        toast.success('Article Saved', `"${post.title}" saved.`);
      }
    } catch (err) {
      toast.error('Failed to Save Article', `${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    try {
      await strapiRequest(`/api/blog-posts/${postId}`, 'DELETE');
      setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Article Deleted', 'Blog publication removed.');
    } catch (err) {
      toast.error('Failed to Delete Article', `${err instanceof Error ? err.message : String(err)}`);
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
        },
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
        toast.info('Article Status Changed', `Status updated to ${newStatus}.`);
      }
    } catch (err) {
      toast.error('Failed to Change Status', `${err instanceof Error ? err.message : String(err)}`);
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
        return role === 'Student';

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
        isAuthenticated,
        authToken,
        login,
        register,
        logout,
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
