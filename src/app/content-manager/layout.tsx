'use client';

import React from 'react';
import { RouteGuard } from '../../components/RouteGuard';

export default function ContentManagerLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={['Content Manager']}>{children}</RouteGuard>;
}
