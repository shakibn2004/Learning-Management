'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLMS } from '../../context/LMSContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  UserCheck,
  Layers,
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    role: 'Admin',
    name: 'Md Nazmus Shakib',
    email: 'admin@gmail.com',
    desc: 'Full system control, user RBAC & financial audit logs',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    role: 'Content Manager',
    name: 'Manager',
    email: 'manager@gmail.com',
    desc: 'Editorial articles, publications & curriculum design',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    btnColor: 'bg-blue-600 hover:bg-blue-500 text-white',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    role: 'Instructor',
    name: 'Instructor',
    email: 'instructor@gmail.com',
    desc: 'Manage enrolled students, lessons, and interactive quizzes',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    btnColor: 'bg-purple-600 hover:bg-purple-500 text-white',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    role: 'Student',
    name: 'Student Saif',
    email: 'student@gmail.com',
    desc: 'Interactive video lessons, code labs, quizzes & gradebook',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    btnColor: 'bg-amber-600 hover:bg-amber-500 text-white',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLMS();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRole, setSuccessRole] = useState<string | null>(null);

  const getDestination = (role: string) => {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Content Manager':
        return '/content-manager/dashboard';
      case 'Instructor':
        return '/instructor/dashboard';
      case 'Student':
        return '/student/dashboard';
      default:
        return '/dashboard';
    }
  };

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;

    if (!loginEmail || !loginPass) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(loginEmail, loginPass);
      if (result.success && result.user) {
        setSuccessRole(result.user.role);
        const destination = getDestination(result.user.role);
        setTimeout(() => {
          router.push(destination);
        }, 600);
      } else {
        setErrorMessage(result.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    handleLogin(undefined, demoEmail, 'password123');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center space-x-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Learn<span className="text-cyan-400">Hub</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              Next-Gen LMS
            </span>
          </div>
        </Link>

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Sign in to your account or pick a 1-click test persona below
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-[#141d2b]/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40">
          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center space-x-3 text-rose-400 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successRole && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-400 text-xs sm:text-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                Authenticated successfully as <strong>{successRole}</strong>! Redirecting...
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@learnhub.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to LearnHub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Personas */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Instant 1-Click Demo Login
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Password: password123</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PERSONAS.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(p.email)}
                  className="text-left p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {p.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badge}`}>
                      {p.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                    {p.desc}
                  </p>
                  <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1 group-hover:underline">
                    Login as {p.role} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-500/40 hover:decoration-cyan-400 transition-colors"
            >
              Create an account / Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
