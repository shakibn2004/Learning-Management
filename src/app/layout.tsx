import './globals.css';
import type { Metadata } from 'next';
import { LMSProvider } from '../context/LMSContext';
import { RoleHeader } from '../components/RoleHeader';

export const metadata: Metadata = {
  title: 'LearnHub LMS - Enterprise Next.js & Strapi Platform',
  description: 'Full-featured Learning Management System frontend with 4-role RBAC access matrix, progress tracking, auto-graded quizzes, and blog management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <LMSProvider>
          <RoleHeader />
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
            {children}
          </div>
        </LMSProvider>
      </body>
    </html>
  );
}
