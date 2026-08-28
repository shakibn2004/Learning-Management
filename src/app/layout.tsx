import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LMSProvider } from '../context/LMSContext';
import { ToastProvider } from '../context/ToastContext';
import { AppShell } from '../components/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SaaSPro LMS - Project-Based Learning Platform',
  description: 'Enterprise Learning Management System with project-based paths, Strapi v5 headless CMS, and multi-role access.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <LMSProvider>
            <AppShell>{children}</AppShell>
          </LMSProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
