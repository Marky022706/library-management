import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { roleHomePath } from '@/services/authService';

export function Unauthorized() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-1 max-w-sm text-sm text-gray-500">You don't have permission to view this page with your current account role.</p>
      </div>
      <Link to={currentUser ? roleHomePath(currentUser.role) : '/login'}>
        <Button>Back to safety</Button>
      </Link>
    </div>
  );
}
