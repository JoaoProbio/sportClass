'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login');
        return;
      }

      if (requireAdmin && user && user.tipo !== 'admin_geral' && user.tipo !== 'admin_turma') {
        router.push('/admin/login');
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, router, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user && user.tipo !== 'admin_geral' && user.tipo !== 'admin_turma') {
    return null;
  }

  return <>{children}</>;
}
