'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLMS } from '../context/LMSContext';
import {
  Code2,
  Layers,
  Cloud,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Star,
  ShieldCheck,
  Zap,
  Play,
  Terminal,
  Compass,
  Laptop,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Check,
  BookOpen,
  Award,
  Shield,
  GitBranch,
  Database,
  Globe,
  Server,
  MessageSquare,
  ChevronDown,
  UserCheck,
  LogIn,
  UserPlus,
  LogOut,
  GraduationCap,
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  {
    id: 'web-dev',
    name: 'Full-Stack Web Systems',
    image: '/discipline-web.jpg',
    desc: 'Build complete applications with Next.js 14 and Strapi Headless CMS.',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps Engineering',
    image: '/discipline-cloud.jpg',
    desc: 'Deploy containerized microservices and automated CI/CD pipelines.',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX & Design Systems',
    image: '/discipline-design.jpg',
    desc: 'Design beautiful, accessible interfaces with modern design tokens.',
  },
  {
    id: 'rbac-security',
    name: 'RBAC Security & Architecture',
    image: '/discipline-security.jpg',
    desc: 'Master multi-tier roles and enterprise permissions architecture.',
  },
];

const PLATFORM_STATS = [
  { value: '100%', label: 'Project-Driven Curriculum', icon: Laptop },
  { value: '4 Roles', label: 'RBAC Permission Security', icon: ShieldCheck },
  { value: '35+', label: 'Production Case Studies', icon: Compass },
  { value: '99.9%', label: 'Cloud Infrastructure Uptime', icon: Zap },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Select Project Discipline',
    desc: 'Pick your track from Full-Stack, Cloud DevOps, AI Systems, or Modern Design Systems.',
  },
  {
    step: '02',
    title: 'Code with Live Backend',
    desc: 'Connect live Strapi v5 REST endpoints with dynamic Next.js App Router frontends.',
  },
  {
    step: '03',
    title: 'Validate via Auto Quizzes',
    desc: 'Test architectural concepts with instant-graded evaluation quizzes.',
  },
  {
    step: '04',
    title: 'Deploy to Cloud',
    desc: 'Ship your production applications to Vercel and Railway with CI/CD automation.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Elena Rostova',
    role: 'Full-Stack Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    text: 'Building hands-on projects with Next.js App Router and real Strapi REST APIs gave me the exact architecture confidence I needed.',
    rating: 5,
    project: 'Full-Stack Masterclass',
  },
  {
    name: 'David Kim',
    role: 'Cloud & Platform Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    text: 'The cloud architecture projects helped me master production deployment on Railway and Docker without configuration pain.',
    rating: 5,
    project: 'Cloud & Docker Architecture',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Lead UI/UX Architect',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    text: 'The design systems and component engineering track represents the cleanest visual standard in modern frontend development.',
    rating: 5,
    project: 'Design Systems & Motion',
  },
];

const TECH_STACK = [
  { name: 'Next.js 14 App Router', category: 'Frontend', icon: Globe, desc: 'Server Components, dynamic routing, and instant hydration.' },
  { name: 'Strapi v5 Headless CMS', category: 'Backend', icon: Server, desc: 'Decoupled REST API, JWT auth, and live content schemas.' },
  { name: 'PostgreSQL Database', category: 'Database', icon: Database, desc: 'Enterprise-grade relational storage with relational indexing.' },
  { name: 'Docker & Microservices', category: 'DevOps', icon: GitBranch, desc: 'Containerized reproducible local & staging environments.' },
  { name: 'Framer Motion', category: 'Animation', icon: Sparkles, desc: 'Smooth spring transitions, layout animations & gestures.' },
  { name: 'Role-Based Access (RBAC)', category: 'Security', icon: Shield, desc: 'Strict multi-tier permissions for 4 portal personas.' },
];

const COMPARISON_FEATURES = [
  { title: 'Full Production Architecture', us: '100% Real Strapi Backend & DB', others: 'Toy mock JSON servers' },
  { title: 'Interactive Multi-Role Portals', us: 'Admin, Instructor, Student, Content Manager', others: 'Single generic view' },
  { title: 'Instant Evaluation Quizzes', us: 'Auto-Graded with Real-Time Progress', others: 'Passive video watching' },
  { title: 'Production Cloud Deployment', us: 'Railway & Vercel Continuous Deployment', others: 'Local localhost only' },
  { title: 'Design System & Accessibility', us: 'WCAG AAA, Glassmorphism Tokens', others: 'Unstyled basic components' },
];

const INSTRUCTORS = [
  {
    name: 'Alexandre Dubois',
    role: 'Principal Full-Stack Architect',
    bio: 'Former Staff Engineer at CloudScale. 12+ years building distributed Next.js and Strapi backends.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    stats: '18 Projects Authored',
  },
  {
    name: 'Marcus Sterling',
    role: 'DevOps & Cloud Lead',
    bio: 'Kubernetes specialist and cloud architect. Expert in containerization and zero-downtime CI/CD pipelines.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    stats: '14 DevOps Tracks',
  },
  {
    name: 'Dr. Tariq Rahman',
    role: 'Head of LMS Engineering',
    bio: 'Software educator and system designer focusing on real-time student evaluation algorithms.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    stats: '22 Quizzes & Labs',
  },
];

const FAQS = [
  {
    q: 'How does the Strapi v5 Backend integration work?',
    a: 'Every project on this platform communicates directly with a real Strapi v5 Headless CMS REST API. You learn how to fetch, mutate, authenticate JWT tokens, and seed database records using enterprise patterns.',
  },
  {
    q: 'Do I get access to all 4 role dashboards?',
    a: 'Yes! The platform includes custom interactive dashboards for Admins, Instructors, Content Managers, and Students, allowing you to master multi-tenant RBAC architecture.',
  },
  {
    q: 'How are the automated quizzes evaluated?',
    a: 'Each project contains built-in knowledge checks with instant grading logic that records attempt histories and unlocks progress completion certificates.',
  },
  {
    q: 'Can I clone and deploy these projects to my own cloud?',
    a: 'Absolutely. All source code is structured with Next.js 14 App Router and Strapi schemas ready for zero-config deployment on Vercel and Railway.',
  },
];

// Luxury Framer Motion Physics Animation Variants
const fadeInUp: any = {
  hidden: { opacity: 0, y: 35, scale: 0.98 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1], // Smooth custom cubic bezier
    },
  }),
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardHoverMotion = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};

const SHOWCASE_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Fullstack SaaS Cloud Metrics Suite',
    category: 'Full-Stack Web',
    level: 'Advanced',
    price: 89,
    image: '/project-saas.jpg',
    tags: ['Next.js 14', 'Strapi v5', 'PostgreSQL'],
    aspect: 'wide',
    stat: 'Live Project',
  },
  {
    id: 'proj-2',
    title: 'Enterprise RBAC User & Permission Hub',
    category: 'Security & Auth',
    level: 'Intermediate',
    price: 49,
    image: '/project-rbac.jpg',
    tags: ['JWT Tokens', '4 Roles', 'Audit Logs'],
    aspect: 'tall',
    stat: 'Interactive Lab',
  },
  {
    id: 'proj-3',
    title: 'Cloud DevOps & Docker Infrastructure',
    category: 'DevOps & Cloud',
    level: 'Advanced',
    price: 79,
    image: '/project-devops.jpg',
    tags: ['Docker', 'Railway', 'CI/CD'],
    aspect: 'square',
    stat: 'Production Ready',
  },
  {
    id: 'proj-4',
    title: 'Orbital Glassmorphic Design System',
    category: 'UI/UX Engineering',
    level: 'All Levels',
    price: 0,
    image: '/project-design.jpg',
    tags: ['Tailwind', 'Framer Motion', 'WCAG'],
    aspect: 'square',
    stat: 'Free Starter',
  },
];

export default function DynamicFramerLandingPage() {
  const { courses, currentUser, isAuthenticated, logout } = useLMS();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Always use crystal clear local high-res projects
  const filteredProjects = activeTab === 'all'
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter((p) => {
        if (activeTab === 'web') return p.category.toLowerCase().includes('web') || p.category.toLowerCase().includes('stack');
        if (activeTab === 'devops') return p.category.toLowerCase().includes('devops') || p.category.toLowerCase().includes('cloud');
        if (activeTab === 'design') return p.category.toLowerCase().includes('design') || p.category.toLowerCase().includes('ui');
        return true;
      });

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden pt-16 sm:pt-20">
      {/* =========================================================================
          TOP FLOATING GLASSMORPHIC NAVBAR WITH LOGIN & REGISTRATION
      ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                Learn<span className="text-cyan-400">Hub</span>
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase font-mono font-bold tracking-widest text-slate-400 -mt-1">
                LMS Platform
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs sm:text-sm font-medium text-slate-300">
            <a href="#categories" className="hover:text-cyan-400 transition-colors">Tracks</a>
            <a href="#featured-projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <Link href="/blogs" className="hover:text-cyan-400 transition-colors">Articles</Link>
            <Link href="/student/catalog" className="hover:text-cyan-400 transition-colors">All Courses</Link>
          </nav>

          {/* Right Auth Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/login"
                  className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1.5"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center space-x-1.5 active:scale-95"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1: HERO SECTION (Chinese University Campus Green Field & Tech Platform)
      ========================================================================= */}
      <section
        style={{
          backgroundImage: `url('/hero-china-campus.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 45%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
        className="relative min-h-[750px] sm:min-h-[850px] flex items-center py-20 sm:py-28"
      >
        {/* Subtle Dark Vignette for Text Clarity over Campus Lawn */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 max-w-xl text-left"
          >
            {/* Simple Clean Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Modern Learning Platform
            </motion.div>

            {/* Clean, Simple & Impactful Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Learn Faster.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Build Real Projects.
              </span>
            </motion.h1>

            {/* Simple Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-lg"
            >
              Explore curated courses, interactive quizzes, and master software engineering skills with hands-on learning.
            </motion.p>

            {/* Simple & Clean Action Buttons with Register and Sign In */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Link
                href="/register"
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/student/catalog"
                className="px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-colors"
              >
                Browse Catalog
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Starlink Floating Scroll Down Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/80 text-xs flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => {
            const el = document.getElementById('categories');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] tracking-widest uppercase font-mono font-bold">SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* =========================================================================
          SECTIONS 2 TO 10: Overlaps smoothly on top of Hero background when scrolling (Dark Luxe Theme)
      ========================================================================= */}
      <div className="relative z-20 bg-slate-950 text-slate-100 rounded-none shadow-[0_-25px_50px_rgba(0,0,0,0.8)] border-t border-white/10">
        {/* =========================================================================
            SECTION 2: PROJECT CATEGORIES (Interactive 3D Lift Cards)
        ========================================================================= */}
        <section id="categories" className="py-14 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PROJECT_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                custom={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col space-y-3 cursor-pointer"
              >
                {/* High-Res Image with Rounded Top and Flat Bottom */}
                <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl rounded-b-none bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>

                {/* Seamless Title and 1-Line Description Merged with Background */}
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 3: FEATURED LIVE PROJECTS (Non-Parallel Asymmetrical Bento Layout)
        ========================================================================= */}
        <section id="featured-projects" className="py-14 sm:py-20 bg-slate-900/60 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            {/* Asymmetrical Non-Parallel Dynamic Bento Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {filteredProjects.map((project, idx) => {
                  const isWide = project.aspect === 'wide';
                  const isTall = project.aspect === 'tall';

                  return (
                    <motion.div
                      key={project.id}
                      variants={fadeInUp}
                      custom={idx}
                      whileHover={{
                        y: -8,
                        scale: 1.01,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                        borderColor: 'rgba(34, 211, 238, 0.4)',
                        transition: { duration: 0.25 },
                      }}
                      className={`group bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between transition-all ${
                        isWide
                          ? 'lg:col-span-8'
                          : isTall
                          ? 'lg:col-span-4 lg:row-span-2'
                          : 'lg:col-span-4'
                      }`}
                    >
                      <div>
                        {/* Non-Parallel Visual Showcase (Image-First) */}
                        <div
                          className={`relative w-full overflow-hidden bg-slate-950 ${
                            isWide
                              ? 'aspect-[16/9] sm:aspect-[21/10]'
                              : isTall
                              ? 'aspect-[4/3] lg:aspect-[3/4]'
                              : 'aspect-[16/10]'
                          }`}
                        >
                          <motion.img
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                        </div>

                        {/* Minimal Concise Info */}
                        <div className="p-5 sm:p-6 space-y-2">
                          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: LEARNING METHODOLOGY (Sequential Step Cards)
        ========================================================================= */}
        <section id="methodology" className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800/60 inline-block">
              OUR METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How The Learning Engine Works
            </h2>
            <p className="text-sm text-slate-400">
              A 4-step execution lifecycle engineered to transform concepts into production software.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {WORKFLOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                custom={idx}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: '0 20px 40px -10px rgba(6, 182, 212, 0.2)',
                  borderColor: 'rgba(34, 211, 238, 0.5)',
                }}
                className="p-7 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4 relative transition-all duration-300"
              >
                <div className="text-4xl font-black text-cyan-400/40 font-mono">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 5: TECH STACK ECOSYSTEM MATRIX
        ========================================================================= */}
        <section id="tech-stack" className="py-24 bg-slate-900 text-white relative overflow-hidden border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-14 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto space-y-3"
            >
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800/60 inline-block">
                CUTTING-EDGE TECH STACK
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Architected with Modern Industry Standards
              </h2>
              <p className="text-sm text-slate-300">
                Learn modern patterns using battle-tested web and cloud technologies.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {TECH_STACK.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{
                      y: -6,
                      scale: 1.02,
                      borderColor: 'rgba(34, 211, 238, 0.5)',
                      boxShadow: '0 15px 35px -10px rgba(6, 182, 212, 0.25)',
                    }}
                    className="p-7 rounded-3xl bg-slate-800/70 border border-slate-700/80 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-700/60 text-slate-300">
                        {tech.category}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white">{tech.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{tech.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: ARCHITECTURAL COMPARISON
        ========================================================================= */}
        <section id="comparison" className="py-24 max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800/60 inline-block">
              THE LMS ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Project-Based LMS Wins
            </h2>
            <p className="text-sm text-slate-400">
              Compare our production-ready platform with conventional generic courses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-white/10 shadow-2xl overflow-hidden bg-slate-900/90 backdrop-blur-xl"
          >
            <div className="grid grid-cols-3 bg-slate-800/80 p-5 border-b border-white/10 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <div>Platform Feature</div>
              <div className="text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our LMS Platform</span>
              </div>
              <div className="text-slate-500">Other Video Courses</div>
            </div>

            <div className="divide-y divide-white/5">
              {COMPARISON_FEATURES.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', x: 4 }}
                  className="grid grid-cols-3 p-5 text-xs items-center transition-all cursor-default"
                >
                  <div className="font-semibold text-white pr-2">{item.title}</div>
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5 pr-2">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{item.us}</span>
                  </div>
                  <div className="text-slate-500 line-through decoration-slate-600 pr-2">
                    {item.others}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 7: PRINCIPAL INSTRUCTORS
        ========================================================================= */}
        <section id="instructors" className="py-24 bg-slate-900/60 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-14">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto space-y-3"
            >
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800/60 inline-block">
                EXPERT MENTORS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Learn from Seasoned Engineers
              </h2>
              <p className="text-sm text-slate-400">
                Industry veterans sharing real production code and architectural patterns.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {INSTRUCTORS.map((ins, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -8, boxShadow: '0 25px 45px -10px rgba(0, 0, 0, 0.7)', borderColor: 'rgba(34, 211, 238, 0.4)' }}
                  className="p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col justify-between space-y-6 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={ins.avatar}
                        alt={ins.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/30 shadow-sm"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white">{ins.name}</h3>
                        <p className="text-xs text-cyan-400 font-semibold">{ins.role}</p>
                        <span className="text-[11px] text-slate-400">{ins.stats}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{ins.bio}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Certified Instructor</span>
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: METRICS & TESTIMONIALS
        ========================================================================= */}
        <section id="testimonials" className="py-24 max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
          {/* Key Metrics with Hover Expansion */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {PLATFORM_STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{
                    y: -6,
                    scale: 1.03,
                    boxShadow: '0 20px 40px -10px rgba(6, 182, 212, 0.2)',
                    borderColor: 'rgba(34, 211, 238, 0.4)',
                  }}
                  className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl flex items-center space-x-4 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 shadow-xs border border-cyan-500/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Testimonial Cards */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto space-y-2"
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Developer Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                What learners and engineers say about our project-based tracks.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {TESTIMONIALS.map((t, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 25px 45px -10px rgba(0, 0, 0, 0.7)',
                    borderColor: 'rgba(34, 211, 238, 0.4)',
                  }}
                  className="p-7 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col justify-between space-y-5 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400/30 shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: INTERACTIVE FAQ ACCORDION
        ========================================================================= */}
        <section id="faqs" className="py-24 bg-slate-900/60 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto space-y-3"
            >
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3.5 py-1 rounded-full border border-cyan-800/60 inline-block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Everything You Need to Know
              </h2>
              <p className="text-sm text-slate-400">
                Clear answers regarding architecture, curriculum, and deployment.
              </p>
            </motion.div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/90 overflow-hidden shadow-xl"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-cyan-400 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: CTA & ENTERPRISE WORKSTATION (Hero-Style Cinematic Canvas)
        ========================================================================= */}
        <section
          style={{
            backgroundImage: `url('/enterprise-devs-cta.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
          className="relative min-h-[600px] sm:min-h-[700px] flex items-center py-20 sm:py-28 overflow-hidden border-t border-white/10"
        >
          {/* Subtle Dark Vignette for Text Clarity over Enterprise Devs */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/40 pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 sm:px-12 w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
              className="max-w-2xl space-y-6 text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 text-xs sm:text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Production-Ready Engineering
              </div>

              {/* Bold Title */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Ready to build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                  enterprise-level projects?
                </span>
              </h2>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95 flex items-center space-x-2"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/student/catalog"
                  className="px-6 py-4 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Modern Footer */}
        <footer className="border-t border-white/10 bg-slate-950 py-10 px-6 sm:px-12 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">
                Learn<span className="text-cyan-400">Hub</span> LMS
              </span>
              <span className="text-slate-500">|</span>
              <span>Full-Stack Engineering Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/login" className="hover:text-cyan-400 transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-cyan-400 transition-colors">Register</Link>
              <Link href="/student/catalog" className="hover:text-cyan-400 transition-colors">Courses</Link>
              <Link href="/blogs" className="hover:text-cyan-400 transition-colors">Blog</Link>
            </div>

            <div className="text-slate-500">
              © {new Date().getFullYear()} LearnHub Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
