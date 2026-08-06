import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getCsrfCookie } from '../api/axios';
import type { User, AuthResponse, RegisterPayload } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string, newPasswordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('bpl_user_data');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('bpl_auth_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveSession = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('bpl_user_data', JSON.stringify(userData));
    localStorage.setItem('bpl_auth_token', authToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bpl_user_data');
    localStorage.removeItem('bpl_auth_token');
  };

  const refreshUser = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('bpl_user_data', JSON.stringify(res.data.user));
      }
    } catch {
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    await getCsrfCookie();
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  const register = async (data: RegisterPayload): Promise<User> => {
    await getCsrfCookie();
    const res = await api.post<AuthResponse>('/auth/register', data);
    saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore API error on logout
    } finally {
      clearSession();
    }
  };

  const updateProfile = async (formData: FormData): Promise<User> => {
    const res = await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem('bpl_user_data', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const changePassword = async (currentPassword: string, newPassword: string, newPasswordConfirmation: string) => {
    await api.post('/profile/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
