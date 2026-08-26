export type UserRole = 'Admin' | 'Content Manager' | 'Instructor' | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  enrolledCourseIds: string[];
  createdAt: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage e.g. 70
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  scorePercentage: number;
  passed: boolean;
  answers: Record<string, string>; // questionId -> optionId
  completedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'text';
  videoUrl?: string;
  content: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  coverImage: string;
  instructorId: string;
  instructorName: string;
  price: number;
  published: boolean;
  lessons: Lesson[];
  quiz?: Quiz;
  createdAt: string;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastAccessedLessonId?: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  status: 'Draft' | 'Published';
  publishedAt?: string;
  createdAt: string;
  tags: string[];
}
