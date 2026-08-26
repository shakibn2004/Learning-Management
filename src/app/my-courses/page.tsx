'use client';

import React from 'react';
import { RouteGuard } from '../../components/RouteGuard';
import { StudentDashboard } from '../../components/StudentDashboard';

export default function MyCoursesPage() {
  return (
    <RouteGuard allowedRoles={['Student']}>
      <StudentDashboard activeTab="my-courses" setActiveTab={() => {}} />
    </RouteGuard>
  );
}
