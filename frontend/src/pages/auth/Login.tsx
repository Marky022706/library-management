import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { roleHomePath } from '@/services/authService';

const DEMO_ACCOUNTS = [
  { role: 'Member', email: 'member@library.test' },
  { role: 'Admin', email: 'admin@library.test' },
  { role: 'Super Admin', email: 'superadmin@library.test' },
];

export function Login() {
  const { login, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(from ?? roleHomePath(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
      <p className="mt-1 text-sm text-gray-500">Log in to your Balingasag Public Library account.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          type="email"
          label="Email address"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-700 hover:text-primary-800">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Log In
        </Button>
      </form>

      <div className="mt-6 rounded-lg border border-primary-100 bg-primary-50/60 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
          <div className="text-xs text-primary-900">
            <p className="font-semibold">Demo accounts (password: "password")</p>
            <ul className="mt-1.5 space-y-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <li key={acc.email} className="flex items-center justify-between gap-2">
                  <span>
                    {acc.role}: <span className="font-mono">{acc.email}</span>
                  </span>
                  <button type="button" onClick={() => fillDemo(acc.email)} className="font-medium underline underline-offset-2 hover:text-primary-700">
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-700 hover:text-primary-800">
          Register here
        </Link>
      </p>
    </div>
  );
}
