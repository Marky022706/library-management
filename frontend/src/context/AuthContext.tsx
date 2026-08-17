import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { useLibraryData } from './LibraryDataContext';
import { userService } from '../services/userService';

const SESSION_KEY = 'balingasag_session_user_id';
const TOKEN_KEY = 'balingasag_session_token';

interface LoginResult {
  ok: boolean;
  error?: string;
  role?: UserRole;
}

interface AuthContextValue {
  currentUser: User | null;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useLibraryData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const savedId = localStorage.getItem(SESSION_KEY);
      const token = localStorage.getItem(TOKEN_KEY);

      if (savedId) {
        // Try live backend API first
        if (token) {
          const res = await userService.getCurrentUser();
          if (res.success && res.data?.user) {
            setCurrentUser(res.data.user);
            setIsInitializing(false);
            return;
          }
        }

        // Fallback to local memory users state
        const match = users.find((u) => u.id === savedId || u.user_id === savedId);
        if (match && match.status === 'active') {
          setCurrentUser(match);
        } else if (!match) {
          localStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setIsInitializing(false);
    };

    restoreSession();
  }, [users]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    // 1. Try API login
    try {
      const res = await userService.login(email, password);
      if (res.success && res.data?.user) {
        const user = res.data.user;
        const role = (res.data.role as UserRole) || (user.role as UserRole);
        setCurrentUser(user);
        localStorage.setItem(SESSION_KEY, user.id || (user as any).user_id);
        if (res.data.token) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
        }
        return { ok: true, role };
      }
      if (res.message && !res.message.includes('connect to the backend')) {
        return { ok: false, error: res.message };
      }
    } catch (e) {
      // API call error fallback
    }

    // 2. Fallback local user state check
    const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() || u.username?.toLowerCase() === email.trim().toLowerCase());

    if (!match) return { ok: false, error: 'No account found with that email or username.' };
    if (!password.trim()) return { ok: false, error: 'Enter your password.' };
    if (match.status === 'pending') return { ok: false, error: 'This account is still pending approval by an administrator.' };
    if (match.status === 'suspended') return { ok: false, error: 'This account has been suspended. Contact a super admin.' };

    setCurrentUser(match);
    localStorage.setItem(SESSION_KEY, match.id);
    return { ok: true, role: match.role };
  };

  const logout = () => {
    userService.logout().catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return <AuthContext.Provider value={{ currentUser, isInitializing, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
