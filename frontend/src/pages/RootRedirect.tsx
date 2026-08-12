import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { roleHomePath } from '@/services/authService';

/** Sends visitors to the right place: their dashboard if logged in, otherwise the login page. */
export function RootRedirect() {
  const { currentUser } = useAuth();
  return <Navigate to={currentUser ? roleHomePath(currentUser.role) : '/login'} replace />;
}
