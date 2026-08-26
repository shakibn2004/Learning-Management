'use client';

import { useEffect } from 'react';
import { useLMS } from '../context/LMSContext';
import { useRouter } from 'next/navigation';

export default function RootIndexPage() {
  const { activeRole } = useLMS();
  const router = useRouter();

  useEffect(() => {
    switch (activeRole) {
      case 'Admin':
        router.replace('/admin/dashboard');
        break;
      case 'Content Manager':
        router.replace('/content-manager/dashboard');
        break;
      case 'Instructor':
        router.replace('/instructor/dashboard');
        break;
      case 'Student':
        router.replace('/student/dashboard');
        break;
      default:
        router.replace('/admin/dashboard');
    }
  }, [activeRole, router]);

  return (
    <div className="p-12 text-center text-xs font-mono text-slate-400">
      Redirecting to active persona route...
    </div>
  );
}
