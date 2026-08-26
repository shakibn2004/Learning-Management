import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LMSProvider } from '../context/LMSContext';
import { RoleHeader } from '../components/RoleHeader';
import { Navbar } from '../components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SaaSPro LMS - Enterprise Next.js Platform',
  description: 'Full-featured Learning Management System frontend with 4-role RBAC access matrix, progress tracking, auto-graded quizzes, and blog management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <LMSProvider>
          <RoleHeader />
          <div className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-start gap-8">
            <Navbar />
            <main className="flex-1 min-w-0 space-y-8">{children}</main>
          </div>
        </LMSProvider>
      </body>
    </html>
  );
}
