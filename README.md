# 🎓 LearnHub Learning Management System (LMS)

A full-featured, modern, and eye-catching **Learning Management System (LMS)** frontend built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. Built to fulfill all requirements for the Junior Software Engineer Project Round.

---

## 🌟 Key Features Completed

### 🔐 1. Strict 4-Role Access Control (RBAC) System
- **Dynamic Role Quick-Switcher Header**: Instantly switch persona between **Admin**, **Content Manager**, **Instructor**, and **Student**.
- **Permission Matrix Modal**: Interactive reference modal displaying the exact 4-role access matrix specified in the requirements.
- **Strict Role-Based Action Protection**: Client & policy guards enforce permissions across pages and modals.

### 👑 2. Admin Control Panel
- Platform-wide statistics (total users per role, active courses, enrollment volume, and revenue).
- Role distribution metrics charts.
- **User Role Management & Reassignment Table**: Promote or demote user roles live (e.g. promoting Student to Instructor or Content Manager).
- Global course and blog management.

### 📝 3. Course & Syllabus Management (Content Manager & Instructor)
- Course creation and editing modal.
- Sequential lesson builder supporting **video stream embeds** (YouTube / HTML5) and **markdown text content**.
- **MCQ Quiz Builder**: Form modal to create multiple choice questions, set correct options, and configure auto-grader explanations.

### 🎓 4. Student Discovery & Enrolled Courses
- Course discovery catalog with search and category filtering (Web Development, Design UI/UX, DevOps & Cloud).
- Single-click course enrollment.
- **Sequential Lesson Player**: Left syllabus sidebar with completion checkmarks, Prev/Next navigation, and **"Mark as Complete"** toggle.

### 📈 5. Progress Tracking & Student Gradebook
- Dynamic progress calculation algorithm: `(Completed Lessons / Total Lessons) * 100%`.
- Persistent accuracy per student per course (synced to `localStorage`).
- Multi-student gradebook roster for Admins, Content Managers, and Instructors.

### 🧠 6. Auto-Graded Quiz Engine
- Interactive MCQ quiz modal with radio option selection.
- Immediate auto-grading calculation upon submission (score %, pass/fail badge, explanation breakdown for wrong answers).
- Celebratory confetti animation trigger on passing score.

### 📰 7. Blog Module (Draft vs. Published Workflow)
- Public blog reader for students.
- Content Managers and Admins can write articles, edit posts, and toggle between **Draft** (hidden from students) and **Published** states.

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Step-by-Step Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shakibn2004/Learning-Management.git
   cd Learning-Management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Glassmorphism design tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Canvas Confetti
