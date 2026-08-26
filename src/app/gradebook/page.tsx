'use client';

import React from 'react';
import { RouteGuard } from '../../components/RouteGuard';
import { Gradebook } from '../../components/Gradebook';

export default function GradebookPage() {
  return (
    <RouteGuard allowedRoles={['Admin', 'Content Manager', 'Instructor']}>
      <Gradebook />
    </RouteGuard>
  );
}
