'use client';

import React from 'react';
import { RouteGuard } from '../../components/RouteGuard';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['Instructor']}>{children}</RouteGuard>;
}
