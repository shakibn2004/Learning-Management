'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { RoleHeader } from './RoleHeader';
import { Navbar } from './Navbar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
        {/* Clean White Landing Page Navigation Header */}
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2.5 font-bold text-xl text-slate-900 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-mono text-sm">
                SP
              </div>
              <span>SaaS<span className="text-blue-600">Pro</span></span>
            </a>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
              <a href="#categories" className="hover:text-blue-600 transition-colors">Categories</a>
              <a href="#featured-projects" className="hover:text-blue-600 transition-colors">Projects</a>
              <a href="#methodology" className="hover:text-blue-600 transition-colors">Methodology</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Reviews</a>
            </nav>

            <div className="flex items-center space-x-3">
              <a
                href="/student/catalog"
                className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                Browse Projects
              </a>
              <a
                href="/admin/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-md"
              >
                Open Dashboard
              </a>
            </div>
          </div>
        </header>

        {/* Full-width Landing Page Content */}
        <main className="flex-1 w-full bg-white">
          {children}
        </main>

        {/* Rich Minimal White Footer with Substantial Height */}
        <footer className="border-t border-slate-200/80 bg-slate-50/70 pt-16 pb-12 px-6 lg:px-12 text-slate-600">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Top Multi-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
              {/* Brand & Mission Column */}
              <div className="lg:col-span-2 space-y-4">
                <a href="/" className="flex items-center space-x-2.5 font-bold text-xl text-slate-900 tracking-tight">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-mono text-sm">
                    SP
                  </div>
                  <span>SaaS<span className="text-blue-600">Pro</span></span>
                </a>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
                  The enterprise-grade project-based Learning Management System designed for engineers mastering modern web architecture, headless CMS integrations, and cloud deployments.
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-700">
                    Next.js 14 App Router
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-white border border-slate-200 text-slate-700">
                    Strapi v5 CMS
                  </span>
                </div>
              </div>

              {/* Column 2: Disciplines & Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Disciplines
                </h4>
                <ul className="space-y-2 text-xs">
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">Full-Stack Web Systems</a></li>
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">Cloud & DevOps Engineering</a></li>
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">UI/UX & Design Systems</a></li>
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">AI & Data Platforms</a></li>
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">Microservices Architecture</a></li>
                </ul>
              </div>

              {/* Column 3: Platform Portals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Access Portals
                </h4>
                <ul className="space-y-2 text-xs">
                  <li><a href="/admin/dashboard" className="hover:text-blue-600 transition-colors">System Admin Portal</a></li>
                  <li><a href="/content-manager/dashboard" className="hover:text-blue-600 transition-colors">Content Director Suite</a></li>
                  <li><a href="/instructor/dashboard" className="hover:text-blue-600 transition-colors">Instructor Course Hub</a></li>
                  <li><a href="/student/dashboard" className="hover:text-blue-600 transition-colors">Student Learning Hub</a></li>
                  <li><a href="/student/catalog" className="hover:text-blue-600 transition-colors">Project Catalog</a></li>
                </ul>
              </div>

              {/* Column 4: Newsletter & Updates */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                  Stay Updated
                </h4>
                <p className="text-xs text-slate-500">
                  Get updates when new production blueprints and courses are released.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to SaaSPro updates!'); }} className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="name@work-email.com"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600 transition-colors shadow-sm"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Bar: Copyright & Compliance */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div>
                © {new Date().getFullYear()} SaaSPro LMS Platform. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <a href="#categories" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                <a href="#featured-projects" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                <a href="#methodology" className="hover:text-slate-900 transition-colors">Security Standards</a>
                <a href="http://localhost:1337/admin" target="_blank" rel="noreferrer" className="hover:text-blue-600 font-semibold transition-colors">
                  Strapi Admin ↗
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard / Portal Layout (Dark theme with Sidebar & Persona Role Switcher)
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <RoleHeader />
      <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-8">
        <Navbar />
        <main className="flex-1 min-w-0 space-y-8">{children}</main>
      </div>
    </div>
  );
};
