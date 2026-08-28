'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { RoleHeader } from './RoleHeader';
import { Navbar } from './Navbar';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!isLandingPage) return;
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950">
        {/* Dynamic Scroll Navbar: Transparent on Hero -> Modern Dark Frosted Floating Pill on Scroll */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? 'py-3 px-4 sm:px-6 pointer-events-none'
              : 'py-5 px-6 sm:px-12 bg-transparent pointer-events-auto'
          }`}
        >
          <div
            className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 pointer-events-auto ${
              isScrolled
                ? 'max-w-5xl bg-slate-900/70 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-2xl px-5 sm:px-8 py-3'
                : 'w-full'
            }`}
          >
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2.5 font-black text-xl tracking-tight">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm shadow-md transition-all ${
                  isScrolled ? 'bg-cyan-400 text-slate-950 shadow-cyan-400/20' : 'bg-white/20 backdrop-blur-md text-white border border-white/30'
                }`}
              >
                SP
              </div>
              <span className="text-white">
                SaaS<span className="text-cyan-400">Pro</span>
              </span>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              <a
                href="#categories"
                className={`transition-colors ${
                  isScrolled ? 'text-slate-300 hover:text-cyan-400' : 'text-white/90 hover:text-cyan-400'
                }`}
              >
                Categories
              </a>
              <a
                href="#featured-projects"
                className={`transition-colors ${
                  isScrolled ? 'text-slate-300 hover:text-cyan-400' : 'text-white/90 hover:text-cyan-400'
                }`}
              >
                Projects
              </a>
              <a
                href="#methodology"
                className={`transition-colors ${
                  isScrolled ? 'text-slate-300 hover:text-cyan-400' : 'text-white/90 hover:text-cyan-400'
                }`}
              >
                Methodology
              </a>
              <a
                href="#testimonials"
                className={`transition-colors ${
                  isScrolled ? 'text-slate-300 hover:text-cyan-400' : 'text-white/90 hover:text-cyan-400'
                }`}
              >
                Reviews
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <a
                href="/student/catalog"
                className={`hidden sm:inline-flex text-xs font-bold px-3 py-2 transition-colors ${
                  isScrolled ? 'text-slate-300 hover:text-white' : 'text-white/90 hover:text-white'
                }`}
              >
                Catalog
              </a>
              <a
                href="/student/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-extrabold shadow-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all hover:scale-105 active:scale-95 border border-cyan-200"
              >
                Open Dashboard
              </a>
            </div>
          </div>
        </header>

        {/* Full-width Landing Page Content */}
        <main className="flex-1 w-full bg-slate-950">
          {children}
        </main>

        {/* Rich Sleek Dark Footer */}
        <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-12 px-6 lg:px-12 text-slate-400">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Top Multi-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
              {/* Brand & Mission Column */}
              <div className="lg:col-span-2 space-y-4">
                <a href="/" className="flex items-center space-x-2.5 font-bold text-xl text-white tracking-tight">
                  <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center text-slate-950 shadow-md font-mono text-sm font-black">
                    SP
                  </div>
                  <span>SaaS<span className="text-cyan-400">Pro</span></span>
                </a>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                  The enterprise-grade project-based Learning Management System designed for engineers mastering modern web architecture, headless CMS integrations, and cloud deployments.
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-white/10 text-slate-300">
                    Next.js 14 App Router
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 border border-white/10 text-slate-300">
                    Strapi v5 CMS
                  </span>
                </div>
              </div>

              {/* Column 2: Disciplines & Projects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Disciplines
                </h4>
                <ul className="space-y-2 text-xs">
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">Full-Stack Web Systems</a></li>
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">Cloud & DevOps Engineering</a></li>
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">UI/UX & Design Systems</a></li>
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">AI & Data Platforms</a></li>
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">Microservices Architecture</a></li>
                </ul>
              </div>

              {/* Column 3: Portals */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Access Portals
                </h4>
                <ul className="space-y-2 text-xs">
                  <li><a href="/admin/dashboard" className="hover:text-cyan-400 transition-colors">System Admin Portal</a></li>
                  <li><a href="/content-manager/dashboard" className="hover:text-cyan-400 transition-colors">Content Director Suite</a></li>
                  <li><a href="/instructor/dashboard" className="hover:text-cyan-400 transition-colors">Instructor Course Hub</a></li>
                  <li><a href="/student/dashboard" className="hover:text-cyan-400 transition-colors">Student Learning Hub</a></li>
                  <li><a href="/student/catalog" className="hover:text-cyan-400 transition-colors">Project Catalog</a></li>
                </ul>
              </div>

              {/* Column 4: Newsletter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Stay Updated
                </h4>
                <p className="text-xs text-slate-400">
                  Get updates when new production blueprints and courses are released.
                </p>
                <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to SaaSPro updates!'); }}>
                  <input
                    type="email"
                    required
                    placeholder="name@work-email.com"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors shadow-sm placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Sub-footer */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div>
                &copy; {new Date().getFullYear()} SaaSPro LMS Platform. All rights reserved.
              </div>
              <div className="flex items-center space-x-6">
                <a href="#categories" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#featured-projects" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#methodology" className="hover:text-white transition-colors">Security Standards</a>
                <a
                  href="http://localhost:1337/admin"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 font-semibold transition-colors"
                >
                  Strapi Admin &nearr;
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
