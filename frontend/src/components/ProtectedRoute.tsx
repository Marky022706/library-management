import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * Frontend-only route guard. Real authorization will be enforced by the PHP/MySQL
 * backend once it exists — this only gates the mock UI experience.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
