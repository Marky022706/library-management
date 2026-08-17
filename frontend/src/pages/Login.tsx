import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LoaderCircle, TriangleAlert } from 'lucide-react';
import { AuthShell } from '../components/layout/AuthShell';
import { Field, inputClasses } from '../components/common/Field';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

export function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSigningIn) return;

    setError('');
    setIsSigningIn(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        setError(result.error ?? 'Unable to sign in.');
        return;
      }
      const rolePath = result.role === 'superadmin' ? 'super_admin' : result.role;
      navigate(`/${rolePath}/dashboard`, { replace: true });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <AuthShell
      headline="Welcome Back."
      tagline="Sign in to manage the catalog, members, and requests from one dashboard."
      title="Sign In"
      subtitle="Enter your credentials to access your account."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-700 hover:text-primary-800">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Field label="Email" htmlFor="login-email" required>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@library.test"
          />
        </Field>

        <Field label="Password" htmlFor="login-password" required>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={cn(inputClasses, 'pr-10')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => showToast("Password reset isn't available in this preview yet.", 'info')}
            className="font-semibold text-primary-700 hover:text-primary-800"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" disabled={isSigningIn} className="w-full justify-center gap-2">
          {isSigningIn ? (
            <>
              <LoaderCircle className="loading-spinner h-4 w-4" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
