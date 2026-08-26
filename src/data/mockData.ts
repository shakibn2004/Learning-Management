import { User, Course, UserCourseProgress, BlogPost, QuizAttempt } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Alex Rivera',
    email: 'alex.admin@learnhub.com',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-cm',
    name: 'Sophia Chen',
    email: 'sophia.chen@learnhub.com',
    role: 'Content Manager',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 'user-inst-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@learnhub.com',
    role: 'Instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
    createdAt: '2026-02-01T14:20:00Z',
  },
  {
    id: 'user-inst-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@learnhub.com',
    role: 'Instructor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: [],
    createdAt: '2026-02-10T11:00:00Z',
  },
  {
    id: 'user-student-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@student.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: ['course-1', 'course-2'],
    createdAt: '2026-03-01T08:15:00Z',
  },
  {
    id: 'user-student-2',
    name: 'David Kim',
    email: 'david.kim@student.edu',
    role: 'Student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    enrolledCourseIds: ['course-1'],
    createdAt: '2026-03-05T16:45:00Z',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Next.js 14 & Strapi Masterclass',
    subtitle: 'Master modern serverless web development with Next.js App Router and Headless Strapi CMS.',
    description: 'A comprehensive step-by-step masterclass covering Next.js Server Components, Strapi REST & GraphQL APIs, Role-Based Access Control, JWT authentication, and Vercel & Railway cloud deployments.',
    category: 'Web Development',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-1',
    instructorName: 'Dr. Marcus Vance',
    price: 89.99,
    published: true,
    createdAt: '2026-02-05T12:00:00Z',
    lessons: [
      {
        id: 'c1-l1',
        courseId: 'course-1',
        title: '1. Course Orientation & Architecture Overview',
        durationMinutes: 12,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Welcome to Full-Stack Next.js 14 & Strapi Masterclass!

In this introductory module, we will explore:
- High-level architecture of Next.js 14 App Router
- Decoupled Headless CMS paradigm with Strapi
- Setting up state management and role permissions
- End-to-end deployment target architecture on Vercel & Railway`,
        order: 1,
      },
      {
        id: 'c1-l2',
        courseId: 'course-1',
        title: '2. Next.js App Router & Server Components',
        durationMinutes: 25,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Deep Dive into React Server Components (RSC)

Server Components allow developers to render UI on the server, significantly improving performance, reducing client bundle size, and enhancing SEO.

#### Key Takeaways:
1. Difference between Client Components (\`'use client'\`) and Server Components.
2. Data fetching paradigms with \`fetch()\` caching options (\`revalidate\`, \`no-store\`).
3. Parallel and Intercepting routes for complex dashboards.`,
        order: 2,
      },
      {
        id: 'c1-l3',
        courseId: 'course-1',
        title: '3. Strapi CMS Setup & Role-Based Access Control',
        durationMinutes: 30,
        type: 'text',
        content: `### Configuring Strapi Roles & Permissions

Strapi provides built-in RBAC capabilities. In this module, we configure four primary roles:

1. **Admin**: Full backend administration.
2. **Content Manager**: Access to Content Manager plugin for editing entries.
3. **Instructor**: Access to course management endpoints.
4. **Student**: Authenticated user with read-only access to enrolled content and submission privileges.

#### Security Best Practices:
- Always enforce JWT validation on API middleware.
- Never trust client-side role claims; sanitize requests on Strapi controllers.`,
        order: 3,
      },
      {
        id: 'c1-l4',
        courseId: 'course-1',
        title: '4. Building the Sequential Progress Tracker',
        durationMinutes: 20,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Progress Calculation Algorithm

Progress for a course is dynamically computed using:
\`\`\`ts
const completionPercentage = (completedLessonsCount / totalLessonsCount) * 100;
\`\`\`
This progress is persisted per student per course in the backend database and synchronized across sessions.`,
        order: 4,
      },
      {
        id: 'c1-l5',
        courseId: 'course-1',
        title: '5. Production Deployment on Vercel & Railway',
        durationMinutes: 18,
        type: 'text',
        content: `### Continuous Integration & Cloud Deployment

- **Vercel**: Deploy Frontend Next.js app with zero configuration, linking Git commits to automatic previews.
- **Railway**: Deploy Strapi Node.js instance paired with PostgreSQL database.
- **Environment Variables**: Manage \`NEXT_PUBLIC_STRAPI_URL\`, \`STRAPI_API_TOKEN\`, and JWT secrets.`,
        order: 5,
      },
    ],
    quiz: {
      id: 'quiz-c1',
      courseId: 'course-1',
      title: 'Next.js 14 & Strapi Architecture Assessment',
      description: 'Test your understanding of Next.js Server Components, Strapi RBAC, and progress logic.',
      passingScore: 75,
      questions: [
        {
          id: 'q1',
          question: 'Which statement accurately describes React Server Components in Next.js App Router?',
          options: [
            { id: 'opt1', text: 'They execute strictly on the browser client during initial hydration.' },
            { id: 'opt2', text: 'They execute on the server and send pre-rendered HTML/RSC payload to the client without adding to bundle size.' },
            { id: 'opt3', text: 'They require the "use client" directive at the top of the file.' },
            { id: 'opt4', text: 'They cannot fetch data from external APIs.' },
          ],
          correctOptionId: 'opt2',
          explanation: 'Server components execute exclusively on the server, generating zero client JavaScript bundle impact.',
        },
        {
          id: 'q2',
          question: 'Where should Role-Based Access Control (RBAC) permissions be strictly enforced?',
          options: [
            { id: 'opt1', text: 'Only on the frontend by hiding buttons.' },
            { id: 'opt2', text: 'In CSS rules using display: none.' },
            { id: 'opt3', text: 'On the backend server/API controllers, validating token roles before executing operations.' },
            { id: 'opt4', text: 'In browser localStorage.' },
          ],
          correctOptionId: 'opt3',
          explanation: 'Security requires backend validation on API endpoints so unauthorized users cannot bypass UI restrictions.',
        },
        {
          id: 'q3',
          question: 'If a course has 5 lessons and a student completes 3 lessons, what is their progress percentage?',
          options: [
            { id: 'opt1', text: '40%' },
            { id: 'opt2', text: '50%' },
            { id: 'opt3', text: '60%' },
            { id: 'opt4', text: '75%' },
          ],
          correctOptionId: 'opt3',
          explanation: '(3 / 5) * 100 = 60% completion rate.',
        },
      ],
    },
  },
  {
    id: 'course-2',
    title: 'Advanced UI/UX & Motion Design for Web Systems',
    subtitle: 'Craft breathtaking digital experiences using CSS Glassmorphism, Tailwind, and Micro-interactions.',
    description: 'Learn modern design system fundamentals, color harmony, typography hierarchy, micro-animations, accessible contrast ratios, and responsive dashboard layouts.',
    category: 'Design & UI/UX',
    level: 'Beginner',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-2',
    instructorName: 'Sarah Jenkins',
    price: 69.99,
    published: true,
    createdAt: '2026-02-12T15:30:00Z',
    lessons: [
      {
        id: 'c2-l1',
        courseId: 'course-2',
        title: '1. Glassmorphism & Modern Aesthetic Tokens',
        durationMinutes: 15,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Glassmorphism CSS Fundamentals

\`\`\`css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
\`\`\`

Glassmorphism provides depth and high aesthetic visual visual quality when paired with subtle gradients.`,
        order: 1,
      },
      {
        id: 'c2-l2',
        courseId: 'course-2',
        title: '2. Dynamic Animations & Micro-Interactions',
        durationMinutes: 22,
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        content: `### Enhancing User Engagement with Motion

Micro-interactions inform users of state changes (e.g. button click states, completion checkmarks, toast alerts) without distracting from the main task.`,
        order: 2,
      },
      {
        id: 'c2-l3',
        courseId: 'course-2',
        title: '3. Accessibility & WCAG Compliance',
        durationMinutes: 18,
        type: 'text',
        content: `### Designing Accessible Dashboards

- Maintain contrast ratio of at least 4.5:1 for normal text.
- Ensure keyboard focus outlines are clear.
- Provide descriptive ARIA labels for interactive icons.`,
        order: 3,
      },
    ],
    quiz: {
      id: 'quiz-c2',
      courseId: 'course-2',
      title: 'UI/UX Principles Checkup',
      description: 'Test your understanding of glassmorphism and accessibility standards.',
      passingScore: 66,
      questions: [
        {
          id: 'q2-1',
          question: 'Which CSS property creates the frosted glass effect in Glassmorphism?',
          options: [
            { id: 'op1', text: 'filter: drop-shadow()' },
            { id: 'op2', text: 'backdrop-filter: blur()' },
            { id: 'op3', text: 'mix-blend-mode: overlay' },
            { id: 'op4', text: 'transform: perspective()' },
          ],
          correctOptionId: 'op2',
          explanation: 'backdrop-filter: blur() applies a blur effect to the background content behind the element.',
        },
        {
          id: 'q2-2',
          question: 'What is the recommended WCAG AA minimum contrast ratio for normal text?',
          options: [
            { id: 'op1', text: '2:1' },
            { id: 'op2', text: '3:1' },
            { id: 'op3', text: '4.5:1' },
            { id: 'op4', text: '7:1' },
          ],
          correctOptionId: 'op3',
          explanation: 'WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text.',
        },
      ],
    },
  },
  {
    id: 'course-3',
    title: 'Cloud Architecture & Microservices with Railway & Docker',
    subtitle: 'Deploy scalable backend services, databases, and microservices with high reliability.',
    description: 'Learn continuous deployment pipelines, environment configuration, database management, microservice communication, and monitoring.',
    category: 'DevOps & Cloud',
    level: 'Advanced',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    instructorId: 'user-inst-1',
    instructorName: 'Dr. Marcus Vance',
    price: 99.99,
    published: true,
    createdAt: '2026-02-18T10:00:00Z',
    lessons: [
      {
        id: 'c3-l1',
        courseId: 'course-3',
        title: '1. Dockerizing Strapi & PostgreSQL Services',
        durationMinutes: 28,
        type: 'text',
        content: `### Docker Setup for Production

Containerizing backend applications ensures consistency across development, staging, and production environments.`,
        order: 1,
      },
    ],
  },
];

export const INITIAL_PROGRESS: UserCourseProgress[] = [
  {
    userId: 'user-student-1',
    courseId: 'course-1',
    completedLessonIds: ['c1-l1', 'c1-l2'],
    lastAccessedLessonId: 'c1-l3',
    updatedAt: '2026-08-25T14:30:00Z',
  },
  {
    userId: 'user-student-1',
    courseId: 'course-2',
    completedLessonIds: ['c2-l1'],
    lastAccessedLessonId: 'c2-l2',
    updatedAt: '2026-08-26T10:15:00Z',
  },
  {
    userId: 'user-student-2',
    courseId: 'course-1',
    completedLessonIds: ['c1-l1'],
    lastAccessedLessonId: 'c1-l2',
    updatedAt: '2026-08-26T12:00:00Z',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Why Next.js 14 App Router & Headless Strapi is the Ultimate Stack',
    excerpt: 'Explore how combining Next.js Server Components with Strapi CMS accelerates development speed while delivering top-tier performance.',
    content: `Modern web development demands speed, security, and exceptional user experiences. The combination of Next.js 14 App Router and Strapi Headless CMS provides an unbeatable architecture for modern applications.

### 1. Server-Side Rendering & Instant Hydration
With React Server Components, initial page renders happen directly on the server, sending pre-rendered markup to the browser. This results in ultra-fast Largest Contentful Paint (LCP) scores and superior SEO.

### 2. Flexible Content Modeling
Strapi allows non-technical content managers to quickly structure content models without touching backend databases directly.

### 3. Decoupled Role-Based Security
By enforcing authentication tokens and strict role policies on the Strapi API level, applications maintain bulletproof data integrity across all roles.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-cm',
    authorName: 'Sophia Chen',
    authorRole: 'Content Manager',
    status: 'Published',
    publishedAt: '2026-08-20T09:00:00Z',
    createdAt: '2026-08-19T14:00:00Z',
    tags: ['Architecture', 'Next.js', 'Strapi'],
  },
  {
    id: 'blog-2',
    title: 'Designing Intuitive Micro-interactions for E-Learning Interfaces',
    excerpt: 'Small animation details, progress rings, and feedback modals double student retention and course completion rates.',
    content: `User interface feedback is crucial in educational platforms. When students mark a lesson complete or receive immediate quiz feedback, visual rewards keep them motivated.

### Micro-feedback Techniques:
- **Instant Confetti on Quiz Pass**: Celebrating achievements triggers dopamine and reinforces learning.
- **Progress Ring Recalculation**: Smooth SVG stroke-dashoffset transitions provide tactile visual progress.
- **Role Permission Indicators**: Clear badge indicators reassure users of their current system authority.`,
    coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-admin',
    authorName: 'Alex Rivera',
    authorRole: 'Admin',
    status: 'Published',
    publishedAt: '2026-08-22T11:30:00Z',
    createdAt: '2026-08-21T16:00:00Z',
    tags: ['UI/UX', 'Design', 'EdTech'],
  },
  {
    id: 'blog-3',
    title: '[Draft] Future Roadmap: AI-Powered Adaptive Quiz Generation',
    excerpt: 'Draft article exploring AI automated question generation based on video lesson transcripts.',
    content: `This is a draft blog post under review by the Content Management team. 

In upcoming releases, instructors will be able to click "Generate Quiz" to automatically digest lesson transcripts and produce high-quality multiple choice assessments.`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    authorId: 'user-cm',
    authorName: 'Sophia Chen',
    authorRole: 'Content Manager',
    status: 'Draft',
    createdAt: '2026-08-26T08:00:00Z',
    tags: ['Draft', 'AI', 'Roadmap'],
  },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'qa-1',
    quizId: 'quiz-c1',
    studentId: 'user-student-1',
    scorePercentage: 100,
    passed: true,
    answers: {
      q1: 'opt2',
      q2: 'opt3',
      q3: 'opt3',
    },
    completedAt: '2026-08-25T15:00:00Z',
  },
];
