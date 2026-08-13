import { Link } from 'react-router-dom';
import { BookX } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
        <BookX className="h-7 w-7" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-xl font-bold text-ink">Page not found</h1>
        <p className="mt-1 text-sm text-muted">The page you're looking for doesn't exist.</p>
      </div>
      <Link to="/login">
        <Button variant="secondary">Back to Login</Button>
      </Link>
    </div>
  );
}
