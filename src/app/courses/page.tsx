'use client';

import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ContentManagerDashboard } from '../../components/ContentManagerDashboard';
import { StudentDashboard } from '../../components/StudentDashboard';

export default function CoursesPage() {
  const { activeRole } = useLMS();

  return activeRole === 'Student' ? (
    <StudentDashboard activeTab="courses" setActiveTab={() => {}} />
  ) : (
    <ContentManagerDashboard />
  );
}
