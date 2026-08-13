import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, TriangleAlert } from 'lucide-react';
import { AuthShell } from '../components/layout/AuthShell';
import { Field, inputClasses } from '../components/common/Field';
import { Button } from '../components/common/Button';
import { useLibraryData } from '../context/LibraryDataContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils/cn';

export function Register() {
  const { registerMember } = useLibraryData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError('Fill in all fields to continue.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = registerMember({ name, email });
    if (!result.ok) {
      setError(result.error ?? 'Unable to create an account.');
      return;
    }

    setError('');
    showToast('Account created — a librarian will review and approve your membership.', 'success');
    navigate('/login', { replace: true });
  };

  return (
    <AuthShell
      headline="Join the Library."
      tagline="Create a member account to reserve books, track loans, and get updates."
      title="Sign Up"
      subtitle="Fill in your details to request a membership."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-700 hover:text-primary-800">
            Sign in
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

        <Field label="Full Name" htmlFor="register-name" required>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className={inputClasses}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Dela Cruz"
          />
        </Field>

        <Field label="Email" htmlFor="register-email" required>
          <input
            id="register-email"
            type="email"
            autoComplete="username"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@library.test"
          />
        </Field>

        <Field label="Password" htmlFor="register-password" required>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={cn(inputClasses, 'pr-10')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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

        <Field label="Confirm Password" htmlFor="register-confirm-password" required>
          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            className={inputClasses}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
          />
        </Field>

        <Button type="submit" className="w-full justify-center gap-2">
          Create Account
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </AuthShell>
  );
}
