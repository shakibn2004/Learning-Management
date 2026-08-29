'use client';

import React, { useState } from 'react';
import { StudentDashboard } from '../../../components/StudentDashboard';

export default function StudentDashboardOverviewPage() {
  const [activeTab, setActiveTab] = useState('my-courses');
  return <StudentDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
}
