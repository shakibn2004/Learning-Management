'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Course, Lesson, Quiz, QuizAttempt, UserCourseProgress, BlogPost } from '../types';
import { INITIAL_USERS, INITIAL_COURSES, INITIAL_PROGRESS, INITIAL_BLOG_POSTS, INITIAL_QUIZ_ATTEMPTS } from '../data/mockData';

interface LMSContextType {
  currentUser: User;
  users: User[];
  courses: Course[];
  progress: UserCourseProgress[];
  blogPosts: BlogPost[];
  quizAttempts: QuizAttempt[];
  activeRole: UserRole;
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
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [progress, setProgress] = useState<UserCourseProgress[]>(INITIAL_PROGRESS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(INITIAL_QUIZ_ATTEMPTS);
  const [activeRole, setActiveRole] = useState<UserRole>('Admin');

  // Load persisted state if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.courses) setCourses(parsed.courses);
        if (parsed.progress) setProgress(parsed.progress);
        if (parsed.blogPosts) setBlogPosts(parsed.blogPosts);
        if (parsed.quizAttempts) setQuizAttempts(parsed.quizAttempts);
        if (parsed.activeRole) setActiveRole(parsed.activeRole);
      }
    } catch (e) {
      console.warn('Failed to load local LMS state', e);
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ users, courses, progress, blogPosts, quizAttempts, activeRole })
      );
    } catch (e) {
      console.warn('Failed to persist LMS state', e);
    }
  }, [users, courses, progress, blogPosts, quizAttempts, activeRole]);

  // Current active user matching current selected role
  const currentUser = users.find((u) => u.role === activeRole) || users[0];

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const enrollInCourse = (courseId: string) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const already = u.enrolledCourseIds.includes(courseId);
          return {
            ...u,
            enrolledCourseIds: already ? u.enrolledCourseIds : [...u.enrolledCourseIds, courseId],
          };
        }
        return u;
      })
    );

    // Initialize progress entry if not exists
    setProgress((prev) => {
      const existing = prev.find((p) => p.userId === currentUser.id && p.courseId === courseId);
      if (existing) return prev;
      return [
        ...prev,
        {
          userId: currentUser.id,
          courseId,
          completedLessonIds: [],
          updatedAt: new Date().toISOString(),
        },
      ];
    });
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

  const toggleLessonComplete = (courseId: string, lessonId: string) => {
    if (!currentUser) return;
    setProgress((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.userId === currentUser.id && p.courseId === courseId
      );
      if (existingIndex > -1) {
        const item = prev[existingIndex];
        const isComp = item.completedLessonIds.includes(lessonId);
        const newCompleted = isComp
          ? item.completedLessonIds.filter((id) => id !== lessonId)
          : [...item.completedLessonIds, lessonId];
        const updated = [...prev];
        updated[existingIndex] = {
          ...item,
          completedLessonIds: newCompleted,
          lastAccessedLessonId: lessonId,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            userId: currentUser.id,
            courseId,
            completedLessonIds: [lessonId],
            lastAccessedLessonId: lessonId,
            updatedAt: new Date().toISOString(),
          },
        ];
      }
    });
  };

  const saveCourse = (courseData: Course) => {
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === courseData.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = courseData;
        return updated;
      }
      return [courseData, ...prev];
    });
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const saveLesson = (courseId: string, lessonData: Lesson) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const existingLessons = c.lessons || [];
          const lIdx = existingLessons.findIndex((l) => l.id === lessonData.id);
          let newLessons = [...existingLessons];
          if (lIdx > -1) {
            newLessons[lIdx] = lessonData;
          } else {
            newLessons.push(lessonData);
          }
          return { ...c, lessons: newLessons };
        }
        return c;
      })
    );
  };

  const deleteLesson = (courseId: string, lessonId: string) => {
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
  };

  const saveQuiz = (courseId: string, quizData: Quiz) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, quiz: quizData } : c))
    );
  };

  const submitQuizAttempt = (quizId: string, answers: Record<string, string>): QuizAttempt => {
    // Find quiz across courses
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

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      studentId: currentUser.id,
      scorePercentage,
      passed,
      answers,
      completedAt: new Date().toISOString(),
    };

    setQuizAttempts((prev) => [attempt, ...prev]);
    return attempt;
  };

  const saveBlogPost = (post: BlogPost) => {
    setBlogPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === post.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = post;
        return copy;
      }
      return [post, ...prev];
    });
  };

  const deleteBlogPost = (postId: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const toggleBlogStatus = (postId: string) => {
    setBlogPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newStatus = p.status === 'Draft' ? 'Published' : 'Draft';
          return {
            ...p,
            status: newStatus,
            publishedAt: newStatus === 'Published' ? new Date().toISOString() : p.publishedAt,
          };
        }
        return p;
      })
    );
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
