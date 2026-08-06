import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Moon,
  Phone,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  rememberMe: z.boolean(),
});

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters.'),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.'),
    email: z.string().trim().email('Enter a valid email address.'),
    phoneNumber: z.string().trim().optional(),
    address: z.string().trim().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type AuthMode = 'login' | 'register';
type ToastState = { type: 'success' | 'error'; message: string } | null;

interface AuthPageProps {
  initialMode: AuthMode;
}

const passwordRules = [
  { label: '8+ characters', test: (value: string) => value.length >= 8 },
  { label: 'Uppercase', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Number', test: (value: string) => /\d/.test(value) },
  { label: 'Symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<AuthMode>(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('bpl_auth_theme') === 'dark');

  const rememberedEmail = localStorage.getItem('bpl_remember_email') ?? '';

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail,
      password: '',
      rememberMe: Boolean(rememberedEmail),
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });

  const registerPassword = registerForm.watch('password');
  const passwordScore = useMemo(
    () => passwordRules.filter((rule) => rule.test(registerPassword || '')).length,
    [registerPassword]
  );

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 4000);
  };

  const toggleTheme = () => {
    setIsDarkMode((current) => {
      const next = !current;
      localStorage.setItem('bpl_auth_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      if (data.rememberMe) {
        localStorage.setItem('bpl_remember_email', data.email);
      } else {
        localStorage.removeItem('bpl_remember_email');
      }

      const loggedUser = await login(data.email, data.password);
      showToast({ type: 'success', message: `Welcome back, ${loggedUser.first_name}! Redirecting...` });
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to login. Please check your email and password.';
      showToast({ type: 'error', message: msg });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register({
        first_name: data.firstName,
        middle_name: data.middleName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        phone_number: data.phoneNumber,
        address: data.address,
      });

      showToast({ type: 'success', message: 'Account created! Digital library card automatically generated.' });
      navigate('/dashboard');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        if (errors.email) registerForm.setError('email', { message: errors.email[0] });
        if (errors.password) registerForm.setError('password', { message: errors.password[0] });
      }
      const msg = err.response?.data?.message || 'Unable to create account. Please review your details.';
      showToast({ type: 'error', message: msg });
    }
  };

  const switchMode = (mode: AuthMode) => {
    setActiveMode(mode);
  };

  return (
    <main className={`auth-page ${isDarkMode ? 'auth-page--dark' : ''}`}>
      <div className="auth-particles" aria-hidden="true">
        {Array.from({ length: 50 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <Link to="/" className="auth-back-link" aria-label="Return to portal home">
        <ArrowLeft size={18} aria-hidden="true" />
        Portal Home
      </Link>

      <button type="button" className="auth-theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
        <Moon size={18} aria-hidden="true" />
      </button>

      {toast && (
        <div className={`auth-toast auth-toast--${toast.type}`} role="status" aria-live="polite">
          {toast.type === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
          <span>{toast.message}</span>
        </div>
      )}

      <section className="auth-shell" aria-label="Balingasag Municipal Library authentication">
        <motion.article
          id="register-card"
          className={`auth-card auth-card--register ${activeMode === 'register' ? 'auth-card--active' : ''}`}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          variants={cardVariants}
        >
          {registerForm.formState.isSubmitting && <div className="auth-progress"></div>}
          <BrandHeader />
          <header className="auth-card__heading">
            <h1>Create Your Account</h1>
            <p>Join Balingasag Municipal Library and get your instant Digital Library Card.</p>
          </header>

          <form className="auth-form" onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
            <div className="auth-form__grid auth-form__grid--three">
              <Field
                id="firstName"
                label="First Name *"
                icon={<User size={17} aria-hidden="true" />}
                placeholder="Juan"
                error={registerForm.formState.errors.firstName?.message}
                {...registerForm.register('firstName')}
              />
              <Field
                id="middleName"
                label="Middle Name"
                icon={<User size={17} aria-hidden="true" />}
                placeholder="Protacio (Optional)"
                error={registerForm.formState.errors.middleName?.message}
                {...registerForm.register('middleName')}
              />
              <Field
                id="lastName"
                label="Last Name *"
                icon={<User size={17} aria-hidden="true" />}
                placeholder="Dela Cruz"
                error={registerForm.formState.errors.lastName?.message}
                {...registerForm.register('lastName')}
              />
            </div>

            <Field
              id="registerEmail"
              label="Email Address *"
              type="email"
              icon={<Mail size={17} aria-hidden="true" />}
              placeholder="juan.delacruz@example.com"
              error={registerForm.formState.errors.email?.message}
              {...registerForm.register('email')}
            />

            <div className="auth-form__grid auth-form__grid--two">
              <Field
                id="phoneNumber"
                label="Phone Number"
                type="tel"
                icon={<Phone size={17} aria-hidden="true" />}
                placeholder="09171234567"
                error={registerForm.formState.errors.phoneNumber?.message}
                {...registerForm.register('phoneNumber')}
              />
              <Field
                id="address"
                label="Address"
                icon={<MapPin size={17} aria-hidden="true" />}
                placeholder="Balingasag, Misamis Oriental"
                error={registerForm.formState.errors.address?.message}
                {...registerForm.register('address')}
              />
            </div>

            <div className="auth-form__grid auth-form__grid--two">
              <Field
                id="registerPassword"
                label="Password *"
                type={showRegisterPassword ? 'text' : 'password'}
                icon={<Lock size={17} aria-hidden="true" />}
                placeholder="Minimum 8 characters"
                error={registerForm.formState.errors.password?.message}
                action={
                  <PasswordToggle
                    isVisible={showRegisterPassword}
                    onToggle={() => setShowRegisterPassword((visible) => !visible)}
                    label="Toggle password visibility"
                  />
                }
                {...registerForm.register('password')}
              />
              <Field
                id="confirmPassword"
                label="Confirm Password *"
                type={showConfirmPassword ? 'text' : 'password'}
                icon={<Lock size={17} aria-hidden="true" />}
                placeholder="Re-enter password"
                error={registerForm.formState.errors.confirmPassword?.message}
                action={
                  <PasswordToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((visible) => !visible)}
                    label="Toggle confirm password visibility"
                  />
                }
                {...registerForm.register('confirmPassword')}
              />
            </div>

            <PasswordStrength score={passwordScore} password={registerPassword || ''} />

            <SubmitButton label="Create Account & Issue Library Card" isLoading={registerForm.formState.isSubmitting} />
          </form>

          <p className="auth-card__footer">
            Already have an account?{' '}
            <button type="button" onClick={() => switchMode('login')}>
              Login
            </button>
          </p>
        </motion.article>

        <motion.article
          id="login-card"
          className={`auth-card auth-card--login ${activeMode === 'login' ? 'auth-card--active' : ''}`}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }}
          variants={cardVariants}
        >
          <BrandHeader compact />
          <header className="auth-card__heading">
            <h1>Welcome Back</h1>
            <p>Sign in to access your library account & digital services.</p>
          </header>

          <form className="auth-form auth-form--login" onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
            <Field
              id="loginEmail"
              label="Email Address"
              type="email"
              icon={<Mail size={17} aria-hidden="true" />}
              placeholder="your.email@example.com"
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <Field
              id="loginPassword"
              label="Password"
              type={showLoginPassword ? 'text' : 'password'}
              icon={<Lock size={17} aria-hidden="true" />}
              placeholder="Enter your password"
              error={loginForm.formState.errors.password?.message}
              action={
                <PasswordToggle
                  isVisible={showLoginPassword}
                  onToggle={() => setShowLoginPassword((visible) => !visible)}
                  label="Toggle login password visibility"
                />
              }
              {...loginForm.register('password')}
            />

            <div className="auth-form__meta">
              <label className="auth-checkbox">
                <input type="checkbox" {...loginForm.register('rememberMe')} />
                <span>Remember Me</span>
              </label>
              <button
                type="button"
                className="auth-link-button text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>

            <SubmitButton label="Login" isLoading={loginForm.formState.isSubmitting} />
          </form>

          <p className="auth-card__footer">
            Don't have an account?{' '}
            <button type="button" onClick={() => switchMode('register')}>
              Sign Up
            </button>
          </p>
        </motion.article>
      </section>
    </main>
  );
};

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
  action?: React.ReactNode;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, icon, error, action, ...props }, ref) => (
    <label className="auth-field" htmlFor={id}>
      <span className="auth-label">{label}</span>
      <span className="auth-input-wrap">
        <span className="auth-input-icon">{icon}</span>
        <input
          id={id}
          ref={ref}
          className="auth-input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {action}
      </span>
      {error && (
        <span id={`${id}-error`} className="auth-error" role="alert">
          {error}
        </span>
      )}
    </label>
  )
);

Field.displayName = 'Field';

const BrandHeader: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={`auth-brand ${compact ? 'auth-brand--compact' : ''}`}>
    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
      BPL
    </div>
    <div>
      <span>Balingasag</span>
      <strong>Municipal Library</strong>
    </div>
  </div>
);

const PasswordToggle: React.FC<{ isVisible: boolean; onToggle: () => void; label: string }> = ({
  isVisible,
  onToggle,
  label,
}) => (
  <button type="button" className="auth-password-toggle" onClick={onToggle} aria-label={label}>
    {isVisible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
  </button>
);

const SubmitButton: React.FC<{ label: string; isLoading: boolean }> = ({ label, isLoading }) => (
  <motion.button
    type="submit"
    className="auth-submit"
    disabled={isLoading}
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
  >
    {isLoading ? <span className="auth-spinner" aria-label="Loading" /> : label}
  </motion.button>
);

const PasswordStrength: React.FC<{ score: number; password: string }> = ({ score, password }) => {
  if (!password) {
    return null;
  }

  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Good' : 'Strong';

  return (
    <div className="auth-strength" aria-live="polite">
      <div className="auth-strength__bar" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={index < score ? 'is-active' : ''} />
        ))}
      </div>
      <span>Password strength: {label}</span>
    </div>
  );
};
