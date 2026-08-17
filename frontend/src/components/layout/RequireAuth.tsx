import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface RequireAuthProps {
  role: UserRole;
}

/** Gates a role's route tree behind the mock session, and keeps each role in its own section. */
export function RequireAuth({ role }: RequireAuthProps) {
  const { currentUser, isInitializing } = useAuth();

  // Wait for the session-restore pass (see AuthContext) before deciding to
  // redirect — otherwise a page reload always bounces to /login first.
  if (isInitializing) return null;
  if (!currentUser) return <Navigate to="/login" replace />;

  const normalizedUserRole = currentUser.role.replace('_', '');
  const normalizedTargetRole = role.replace('_', '');
  const userRolePath = currentUser.role === 'superadmin' ? 'super_admin' : currentUser.role;

  if (normalizedUserRole !== normalizedTargetRole) {
    return <Navigate to={`/${userRolePath}/dashboard`} replace />;
  }

  return <Outlet />;
}
