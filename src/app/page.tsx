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
} from 'lucide-react';

const PROJECT_CATEGORIES = [
  {
    id: 'web-dev',
    name: 'Full-Stack Web Systems',
    icon: Code2,
    badge: 'Popular',
    desc: 'Build complete applications with Next.js 14, React Server Components, and decoupled Strapi Headless CMS.',
    projectsCount: '14 Projects',
    tags: ['Next.js 14', 'Strapi v5', 'Tailwind', 'PostgreSQL'],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps Engineering',
    icon: Cloud,
    badge: 'Enterprise',
    desc: 'Deploy containerized microservices, automate CI/CD pipelines, and configure production Railway clusters.',
    projectsCount: '9 Projects',
    tags: ['Docker', 'Railway', 'CI/CD', 'Kubernetes'],
  },
  {
    id: 'ui-ux',
    name: 'UI/UX & Design Systems',
    icon: Layers,
    badge: 'Creative',
    desc: 'Design beautiful, accessible interfaces with Glassmorphism tokens, micro-interactions, and WCAG standards.',
    projectsCount: '12 Projects',
    tags: ['Design Tokens', 'Glassmorphism', 'a11y', 'Figma'],
  },
  {
    id: 'ai-data',
    name: 'AI & Data Platforms',
    icon: Cpu,
    badge: 'Advanced',
    desc: 'Integrate LLM API workflows, vector databases, structured query builders, and intelligent pipelines.',
    projectsCount: '8 Projects',
    tags: ['OpenAI / Gemini', 'Vector DB', 'Automations'],
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

// Premium Motion animation variants
const fadeInUp: any = {
  hidden: { opacity: 0, y: 35 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: i * 0.08,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
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
  const { courses } = useLMS();
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
    <div className="w-full bg-white text-slate-900 overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO SECTION (Clean Sky-Cyan & Pure White Typography Parallax)
      ========================================================================= */}
      <section
        style={{
          backgroundImage: `url('/hero-male-students-sunset.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
        className="relative min-h-[680px] sm:min-h-[780px] flex items-center justify-center py-20 sm:py-28"
      >
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Bold Extra-Large Headline with Vibrant Sky-Cyan Accent (No Black Shadow) */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.08]"
            >
              Learn by building.<br />
              <span className="text-cyan-400">
                Master real projects.
              </span>
            </motion.h1>

            {/* Clear & Large Subtitle without Black Shadow */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-semibold"
            >
              Interactive project-based learning with Next.js 14 and live Strapi v5 CMS.
            </motion.p>

            {/* Vibrant Sky-Cyan Action Button */}
            <motion.div variants={fadeInUp} className="pt-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link
                  href="/student/catalog"
                  className="inline-flex items-center gap-3 px-9 py-4 sm:px-10 sm:py-5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-base sm:text-lg font-extrabold shadow-xl transition-all border border-cyan-200"
                >
                  <span>Start Learning Projects</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECTIONS 2 TO 10: Overlaps smoothly on top of Hero background when scrolling
      ========================================================================= */}
      <div className="relative z-20 bg-white rounded-t-[40px] shadow-[0_-25px_50px_rgba(0,0,0,0.18)] border-t border-slate-100">
        {/* =========================================================================
            SECTION 2: PROJECT CATEGORIES (Interactive 3D Lift Cards)
        ========================================================================= */}
        <section id="categories" className="py-20 sm:py-28 max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
              PROJECT CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated Hands-On Disciplines
            </h2>
            <p className="text-sm text-slate-600">
              Structured tracks tailored for software engineers, product designers, and DevOps professionals.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {PROJECT_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  variants={fadeInUp}
                  custom={idx}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: '0 20px 35px -10px rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(147, 197, 253, 0.8)',
                    transition: { duration: 0.25, ease: 'easeOut' },
                  }}
                  className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm transition-colors duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {cat.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {cat.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/80 font-medium group-hover:border-blue-100 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">{cat.projectsCount}</span>
                    <Link
                      href="/student/catalog"
                      className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>View Track</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 3: FEATURED LIVE PROJECTS (Non-Parallel Asymmetrical Bento Layout)
        ========================================================================= */}
        <section id="featured-projects" className="py-24 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
                  CURATED LIVE CODEBASES
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Visual Architecture Showcases
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Explore real-world software architectures with rich interactive visual previews.
                </p>
              </div>

              {/* Filter Pills with Spring Transition */}
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
                {['all', 'web', 'devops', 'design'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeTab === tab ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeFilterPill"
                        className="absolute inset-0 bg-blue-600 rounded-xl shadow-md -z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 uppercase text-[11px] font-bold">
                      {tab === 'all' ? 'All' : tab === 'web' ? 'Web Dev' : tab === 'devops' ? 'DevOps' : 'UI/UX'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

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
                        boxShadow: '0 25px 45px -12px rgba(0, 0, 0, 0.12)',
                        transition: { duration: 0.25 },
                      }}
                      className={`group bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
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
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                          {/* Floating Category & Level Badges */}
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                            <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-white/95 backdrop-blur-md text-slate-900 shadow-md">
                              {project.category}
                            </span>
                            <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-md">
                              {project.level}
                            </span>
                          </div>

                          {/* Floating Stat Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 rounded-xl text-[11px] font-mono font-bold bg-black/60 backdrop-blur-md text-cyan-300 border border-white/20 shadow-md">
                              {project.stat}
                            </span>
                          </div>

                          {/* Floating Bottom Tech Tags */}
                          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-1.5">
                            {project.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-medium text-slate-200 border border-white/10"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Minimal Concise Title */}
                        <div className="p-6 space-y-2">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Clean Bottom Action Row */}
                      <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                            Tuition
                          </span>
                          <span className="text-base font-extrabold text-slate-900">
                            {project.price === 0 ? 'Free Lab' : `$${project.price.toFixed(2)}`}
                          </span>
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                            href="/student/catalog"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md"
                          >
                            <span>Inspect Project</span>
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </Link>
                        </motion.div>
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
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
              OUR METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How The Learning Engine Works
            </h2>
            <p className="text-sm text-slate-600">
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
                  boxShadow: '0 15px 30px -10px rgba(59, 130, 246, 0.15)',
                  borderColor: 'rgba(147, 197, 253, 0.9)',
                }}
                className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 relative transition-colors duration-300"
              >
                <div className="text-4xl font-black text-blue-600/30 font-mono">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 5: TECH STACK ECOSYSTEM MATRIX (NEW)
        ========================================================================= */}
        <section id="tech-stack" className="py-24 bg-slate-900 text-white relative overflow-hidden">
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
                      borderColor: 'rgba(34, 211, 238, 0.4)',
                    }}
                    className="p-7 rounded-3xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4 transition-all"
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
            SECTION 6: ARCHITECTURAL COMPARISON (NEW)
        ========================================================================= */}
        <section id="comparison" className="py-24 max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto space-y-3"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
              THE LMS ADVANTAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Project-Based LMS Wins
            </h2>
            <p className="text-sm text-slate-600">
              Compare our production-ready platform with conventional generic courses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white"
          >
            <div className="grid grid-cols-3 bg-slate-50/80 p-5 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <div>Platform Feature</div>
              <div className="text-blue-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our LMS Platform</span>
              </div>
              <div className="text-slate-500">Other Video Courses</div>
            </div>

            <div className="divide-y divide-slate-100">
              {COMPARISON_FEATURES.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 p-5 text-xs items-center hover:bg-slate-50/50 transition-colors"
                >
                  <div className="font-semibold text-slate-900 pr-2">{item.title}</div>
                  <div className="text-blue-700 font-bold flex items-center gap-1.5 pr-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item.us}</span>
                  </div>
                  <div className="text-slate-500 line-through decoration-slate-300 pr-2">
                    {item.others}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 7: PRINCIPAL INSTRUCTORS (NEW)
        ========================================================================= */}
        <section id="instructors" className="py-24 bg-slate-50/70 border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-14">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto space-y-3"
            >
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
                EXPERT MENTORS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Learn from Seasoned Engineers
              </h2>
              <p className="text-sm text-slate-600">
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
                  whileHover={{ y: -8, boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.1)' }}
                  className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={ins.avatar}
                        alt={ins.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-100 shadow-sm"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{ins.name}</h3>
                        <p className="text-xs text-blue-600 font-semibold">{ins.role}</p>
                        <span className="text-[11px] text-slate-500">{ins.stats}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{ins.bio}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
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
            SECTION 8: METRICS & TESTIMONIALS (Dynamic Floating Reviews)
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
                    boxShadow: '0 15px 30px -10px rgba(0, 0, 0, 0.08)',
                  }}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{stat.label}</div>
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Developer Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
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
                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.1)',
                  }}
                  className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                      <span className="text-[11px] text-slate-500 block">{t.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: INTERACTIVE FAQ ACCORDION (NEW)
        ========================================================================= */}
        <section id="faqs" className="py-24 bg-slate-50/70 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto space-y-3"
            >
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Everything You Need to Know
              </h2>
              <p className="text-sm text-slate-600">
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
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
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
                        className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4"
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
            SECTION 10: CTA & GET STARTED (Animated Glow & Spring Hover)
        ========================================================================= */}
        <section className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
            className="rounded-[36px] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-8 sm:p-14 text-center shadow-2xl shadow-blue-500/25 space-y-7 relative overflow-hidden"
          >
            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Ready to build enterprise-level projects?
              </h2>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Start building full-stack applications with real Strapi backend integration and role-based permissions today.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/student/catalog"
                  className="inline-block px-8 py-4 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold shadow-lg transition-colors"
                >
                  Start Learning Now
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/admin/dashboard"
                  className="inline-block px-8 py-4 rounded-2xl bg-blue-800/60 hover:bg-blue-800 text-white text-sm font-semibold border border-blue-400/40 transition-colors"
                >
                  Open Admin Portal
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
