import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export interface RoleGuardProps {
  role: UserRole | UserRole[];
  children: ReactNode;
}

/** Restricts a single nested route (e.g. a Super Admin-only page) beyond the parent ProtectedRoute check. */
export function RoleGuard({ role, children }: RoleGuardProps) {
  const { currentUser } = useAuth();
  const allowed = Array.isArray(role) ? role : [role];

  if (!currentUser || !allowed.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
