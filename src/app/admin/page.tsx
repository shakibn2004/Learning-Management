'use client';

import React from 'react';
import { RouteGuard } from '../../components/RouteGuard';
import { AdminDashboard } from '../../components/AdminDashboard';

export default function AdminPage() {
  return (
    <RouteGuard allowedRoles={['Admin']}>
      <AdminDashboard />
    </RouteGuard>
  );
}
