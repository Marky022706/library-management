import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { RoleName } from '../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleName[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const currentRole = user?.role?.role_name;

  if (!currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
