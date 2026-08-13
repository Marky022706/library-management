import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { useLibraryData } from './LibraryDataContext';

const SESSION_KEY = 'balingasag_session_user_id';

interface LoginResult {
  ok: boolean;
  error?: string;
  role?: UserRole;
}

interface AuthContextValue {
  currentUser: User | null;
  /** True until the initial session-restore pass has run. `RequireAuth` waits on
   *  this so it doesn't redirect to /login before localStorage has been checked. */
  isInitializing: boolean;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users } = useLibraryData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore the mock "session" on load (and whenever the underlying user
  // record changes, e.g. a super admin suspending the signed-in account).
  useEffect(() => {
    const savedId = localStorage.getItem(SESSION_KEY);
    if (savedId) {
      const match = users.find((u) => u.id === savedId);
      if (match && match.status === 'active') {
        setCurrentUser(match);
      } else if (!match) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsInitializing(false);
  }, [users]);

  const login = (email: string, password: string): LoginResult => {
    const match = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!match) return { ok: false, error: 'No account found with that email.' };
    if (!password.trim()) return { ok: false, error: 'Enter your password.' };
    if (match.status === 'pending') return { ok: false, error: 'This account is still pending approval.' };
    if (match.status === 'suspended') return { ok: false, error: 'This account has been suspended. Contact a super admin.' };

    setCurrentUser(match);
    localStorage.setItem(SESSION_KEY, match.id);
    return { ok: true, role: match.role };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return <AuthContext.Provider value={{ currentUser, isInitializing, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
