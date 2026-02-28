import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../backend';
import { Loader2, Gem } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, currentRole, isLoading, isFetched } = useAuth();

  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="flex flex-col items-center gap-4">
          <Gem className="h-10 w-10 text-gold-DEFAULT animate-pulse" />
          <Loader2 className="h-6 w-6 text-emerald-DEFAULT animate-spin" />
          <p className="text-muted-foreground font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to="/access-denied" />;
  }

  return <>{children}</>;
}
